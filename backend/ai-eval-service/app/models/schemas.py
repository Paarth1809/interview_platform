from pydantic import BaseModel
from typing import List, Optional

class EvaluateRequest(BaseModel):
    questionId: int
    questionText: str
    sampleAnswer: str
    candidateResponse: str

class EvaluateResponse(BaseModel):
    score: float
    keywordCoverage: float
    semanticSimilarity: float
    sentiment: str
    feedback: List[str]
