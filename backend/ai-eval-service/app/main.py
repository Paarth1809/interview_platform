from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from app.models.schemas import EvaluateRequest, EvaluateResponse
from sentence_transformers import SentenceTransformer, util
import google.generativeai as genai
import os
import shutil
import tempfile
from dotenv import load_dotenv

from app.utils.preprocess import clean_text
from app.utils.keywords import extract_keywords, keyword_coverage
from app.utils.sentiment import detect_sentiment
from app.utils.feedback import generate_feedback

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI(title="AI Evaluation Service")

# Keep local model for hybrid scoring or fallback
model = SentenceTransformer("sentence-transformers/all-mpnet-base-v2")

@app.post("/evaluate", response_model=EvaluateResponse)
def evaluate(req: EvaluateRequest):
    # (Existing text-only logic remains the same)
    sample = clean_text(req.sampleAnswer)
    response = clean_text(req.candidateResponse)

    keys = extract_keywords(sample)
    coverage = keyword_coverage(keys, response)

    emb_sample = model.encode(sample, convert_to_tensor=True)
    emb_resp = model.encode(response, convert_to_tensor=True)
    sim = util.cos_sim(emb_sample, emb_resp).item()

    sentiment = detect_sentiment(req.candidateResponse)
    score = (sim * 0.7) + (coverage * 0.3)
    feedback = generate_feedback(sim, coverage, sample_answer=req.sampleAnswer, candidate_response=req.candidateResponse)

    return EvaluateResponse(
        score=round(score, 3),
        keywordCoverage=round(coverage, 3),
        semanticSimilarity=round(sim, 3),
        sentiment=sentiment,
        feedback=feedback
    )

@app.post("/evaluate-audio")
async def evaluate_audio(file: UploadFile = File(...), sampleAnswer: str = Form(default="")):
    try:
        # Save temp file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as temp_audio:
            shutil.copyfileobj(file.file, temp_audio)
            temp_audio_path = temp_audio.name

        # Use Gemini Flash (Multimodal)
        # It can transcribe AND evaluate in one go
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Upload to Gemini
        audio_file = genai.upload_file(temp_audio_path, mime_type="audio/webm")
        
        prompt = f"""
        ACT AS an expert technical interviewer.
        
        TASK:
        1. Transcribe the audio file verbatim.
        2. Evaluate the candidate's answer against this sample answer: "{sampleAnswer}"
        
        OUTPUT JSON:
        {{
            "transcript": "Full transcription text here...",
            "score": 0.85,  (0.0 to 1.0 based on correctness)
            "feedback": "Constructive feedback here..."
        }}
        """
        
        response = model.generate_content([prompt, audio_file])
        
        # Cleanup
        os.unlink(temp_audio_path)
        
        # Parse result
        # Gemini usually returns markdown json like ```json ... ```
        raw_text = response.text
        import json
        
        try:
            # Extract JSON from code block if present
            if "```json" in raw_text:
                json_str = raw_text.split("```json")[1].split("```")[0]
            elif "```" in raw_text:
                 json_str = raw_text.split("```")[1].split("```")[0]
            else:
                json_str = raw_text
                
            result = json.loads(json_str)
            return result
            
        except json.JSONDecodeError:
            print(f"JSON Parse Error. Raw: {raw_text}")
            return {
                "transcript": raw_text,
                "score": 0.5,
                "feedback": "Could not parse structured analysis. See transcript."
            }

    except Exception as e:
        print(f"Processing Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
