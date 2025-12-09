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

// AUDIO + STT + EVAL
app.post("/api/submit-audio", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No audio file uploaded" });

    const audioBuffer = req.file.buffer;

    const form = new FormData();
    form.append("file", audioBuffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });
    form.append("model", "gpt-4o-transcribe");

    const sttResp = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
      body: form,
    });

    const sttJson = await sttResp.json();
    const transcript = sttJson.text || "";

    const prompt = `
Evaluate the candidate:
Transcript: ${transcript}

Return JSON:
{ 
 "clarity": number,
 "correctness": number,
 "completeness": number,
 "overall": number,
 "feedback": "string"
}
`;

    const evalResp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
      }),
    });

    const evalJson = await evalResp.json();
    const evaluation = JSON.parse(evalJson?.choices?.[0]?.message?.content ?? "{}");

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
      // Don't fail the request if DB fails
      savedId = "error-saving-" + Date.now();
    }

    res.json({ transcript, evaluation, savedId });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Server listening on :3000"));
