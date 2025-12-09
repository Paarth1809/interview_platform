import express from "express";
import cors from "cors";
import multer from "multer";
import fetch from "node-fetch";
import dotenv from "dotenv";
import FormData from "form-data";
import mongoose from "mongoose";
import ResponseModel from "./src/models/Response.js";
import authRoutes from "./src/routes/auth.js";

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://admin:admin123@localhost:27017/interview?authSource=admin")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

const app = express();
app.use(express.json());
// Enable CORS so frontend dev server can call API
app.use(cors({ origin: true, credentials: true }));

const upload = multer({ storage: multer.memoryStorage() });
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Auth routes
app.use("/auth", authRoutes);

// Test
app.get("/", (req, res) => res.send("Backend running..."));

// AUDIO + STT + EVAL (Gemini via Python Service)
app.post("/api/submit-audio", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No audio file uploaded" });

    // Forward to Python Service (Gemini)
    // Python service is expected to be running at http://localhost:8001
    const pythonServiceUrl = "http://localhost:8001/evaluate-audio";

    const form = new FormData();
    form.append("file", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    // Pass sample answer if available (could be added to request body)
    // For now we send a generic or empty one, or extract from req.body if frontend sends it
    const sampleAnswer = req.body.sampleAnswer || "";
    form.append("sampleAnswer", sampleAnswer);

    const pyResp = await fetch(pythonServiceUrl, {
      method: "POST",
      body: form,
    });

    if (!pyResp.ok) {
      const errText = await pyResp.text();
      throw new Error(`Python Service Error: ${errText}`);
    }

    const aiResult = await pyResp.json();

    // Map Python result to expected frontend format
    const transcript = aiResult.transcript || "";
    const feedback = aiResult.feedback || "No feedback generated.";
    const score = (aiResult.score || 0) * 100; // Convert 0-1 to 0-100

    const evaluation = {
      overall: score,
      feedback: feedback,
      clarity: 0, // Placeholder
      correctness: score,
      completeness: 0 // Placeholder
    };

    let savedId = null;
    try {
      if (mongoose.connection.readyState === 1) {
        const saved = await ResponseModel.create({ transcript, evaluation });
        savedId = saved._id;
      } else {
        console.warn("MongoDB not connected, skipping save.");
        savedId = "temp-" + Date.now();
      }
    } catch (dbErr) {
      console.error("DB Save Error:", dbErr);
      savedId = "error-saving-" + Date.now();
    }

    res.json({ transcript, evaluation, savedId });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Server listening on :3000"));
