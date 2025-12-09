package com.example.qa_service.service;

import com.example.qa_service.model.Answer;
import com.example.qa_service.repository.AnswerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class AIEvaluationService {

    @Autowired
    private AnswerRepository answerRepository;

    private final RestTemplate restTemplate = new RestTemplate();
    private final String AI_URL = "http://localhost:8001/evaluate";

    public Answer evaluateAndSave(int questionId,
                                  String questionText,
                                  String sampleAnswer,
                                  String candidateResponse) {

        Map<String, Object> payload = new HashMap<>();
        payload.put("questionId", questionId);
        payload.put("questionText", questionText);
        payload.put("sampleAnswer", sampleAnswer);
        payload.put("candidateResponse", candidateResponse);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload);
        ResponseEntity<Map> response =
                restTemplate.postForEntity(AI_URL, request, Map.class);

        Map<String, Object> ai = response.getBody();

        Answer ans = new Answer();
        ans.setQuestionId(questionId);
        ans.setCandidateResponse(candidateResponse);
        ans.setScore(((Number) ai.get("score")).doubleValue());
        ans.setKeywordCoverage(((Number) ai.get("keywordCoverage")).doubleValue());
        ans.setSemanticSimilarity(((Number) ai.get("semanticSimilarity")).doubleValue());
        ans.setSentiment((String) ai.get("sentiment"));
        ans.setFeedback(ai.get("feedback").toString());

        return answerRepository.save(ans);
    }
}
