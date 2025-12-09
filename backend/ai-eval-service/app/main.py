from fastapi import FastAPI
from app.models.schemas import EvaluateRequest, EvaluateResponse
from sentence_transformers import SentenceTransformer, util

from app.utils.preprocess import clean_text
from app.utils.keywords import extract_keywords, keyword_coverage
from app.utils.sentiment import detect_sentiment
from app.utils.feedback import generate_feedback

app = FastAPI(title="AI Evaluation Service")

model = SentenceTransformer("sentence-transformers/all-mpnet-base-v2")

@app.post("/evaluate", response_model=EvaluateResponse)
def evaluate(req: EvaluateRequest):

    sample = clean_text(req.sampleAnswer)
    response = clean_text(req.candidateResponse)

    # Keywords
    keys = extract_keywords(sample)
    coverage = keyword_coverage(keys, response)

    # Semantic Similarity
    emb_sample = model.encode(sample, convert_to_tensor=True)
    emb_resp = model.encode(response, convert_to_tensor=True)
    sim = util.cos_sim(emb_sample, emb_resp).item()

    # Sentiment
    sentiment = detect_sentiment(req.candidateResponse)

    # Score (weighted)
    score = (sim * 0.7) + (coverage * 0.3)

    # Feedback
    feedback = generate_feedback(sim, coverage)

    return EvaluateResponse(
        score=round(score, 3),
        keywordCoverage=round(coverage, 3),
        semanticSimilarity=round(sim, 3),
        sentiment=sentiment,
        feedback=feedback
    )
