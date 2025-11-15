// server.js (Node + Express)
import express from "express";
import multer from "multer";
import fetch from "node-fetch";
import dotenv from "dotenv";
import FormData from "form-data";
import Response from "./src/models/Response.js";
import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/interview", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB error:", err));


dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Basic test route
app.get("/", (req, res) => {
  res.send("Backend running...");
});

// -------------------------------
//  POST /api/submit-audio
// -------------------------------
app.post("/api/submit-audio", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file uploaded" });
    }

    const audioBuffer = req.file.buffer;

        // -------- STT Request --------
        const form = new FormData();
        form.append("file", audioBuffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype
        });
        form.append("model", "gpt-4o-transcribe");

        const sttResp = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: form,
        });

        const sttJson = await sttResp.json();
        const transcript = sttJson.text || sttJson.transcript || "";


    // -------- Evaluation Prompt --------
    const prompt = `
You are an interviewer evaluator.  
Evaluate this candidate's answer.

Transcript:
${transcript}

Rubric:
- clarity (1-10)
- correctness (1-10)
- completeness (1-10)
Return JSON only:
{
 "clarity": number,
 "correctness": number,
 "completeness": number,
 "overall": number,
 "feedback": "string"
}
`;

    // -------- LLM Evaluation --------
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
    const evaluationText = evalJson.choices?.[0]?.message?.content || "{}";

    let evaluation;
    try {
      evaluation = JSON.parse(evaluationText);
    } catch {
      evaluation = { raw: evaluationText };
    }

    // SEND RESPONSE BACK TO FRONTEND
    const saved = await Response.create({
  transcript,
  evaluation
});

res.json({
  transcript,
  evaluation,
  savedId: saved._id
});


  } catch (err) {
    console.error("Error in submit-audio:", err);
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------
// Start Server
// -------------------------------
app.listen(3000, () => {
  console.log("Server listening on :3000");
});
