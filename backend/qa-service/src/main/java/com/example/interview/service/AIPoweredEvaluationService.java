package com.example.interview.service;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class AIPoweredEvaluationService implements EvaluationService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String AI_SERVICE_URL = "http://localhost:8001/evaluate";

    @Override
    public double scoreAnswer(String sampleAnswer, String response) {
        try {
            Map<String, Object> aiResult = callAIService(sampleAnswer, response);
            if (aiResult != null && aiResult.containsKey("score")) {
                return ((Number) aiResult.get("score")).doubleValue();
            }
        } catch (Exception e) {
            System.err.println("AI Service error: " + e.getMessage());
            // Fallback to basic scoring if AI service fails
            return fallbackScore(sampleAnswer, response);
        }
        return fallbackScore(sampleAnswer, response);
    }

    @Override
    public String feedbackFor(String sampleAnswer, String response) {
        try {
            Map<String, Object> aiResult = callAIService(sampleAnswer, response);
            if (aiResult != null && aiResult.containsKey("feedback")) {
                return (String) aiResult.get("feedback");
            }
        } catch (Exception e) {
            System.err.println("AI Service error: " + e.getMessage());
        }
        return "Unable to generate feedback at this time.";
    }

    private Map<String, Object> callAIService(String sampleAnswer, String response) {
        Map<String, String> payload = new HashMap<>();
        payload.put("sampleAnswer", sampleAnswer);
        payload.put("candidateResponse", response);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, String>> request = new HttpEntity<>(payload, headers);

        try {
            ResponseEntity<Map> apiResponse = restTemplate.postForEntity(
                    AI_SERVICE_URL,
                    request,
                    Map.class);
            return apiResponse.getBody();
        } catch (Exception e) {
            System.err.println("Failed to call AI service: " + e.getMessage());
            return null;
        }
    }

    // Fallback scoring if AI service is unavailable
    private double fallbackScore(String sample, String response) {
        if (response == null || response.trim().isEmpty())
            return 0.0;
        int matchedWords = 0;
        String[] sampleWords = sample.toLowerCase().split("\\W+");
        String responseLower = response.toLowerCase();

        for (String word : sampleWords) {
            if (word.length() > 3 && responseLower.contains(word)) {
                matchedWords++;
            }
        }

        return Math.min(1.0, (double) matchedWords / Math.max(1, sampleWords.length));
    }
}
