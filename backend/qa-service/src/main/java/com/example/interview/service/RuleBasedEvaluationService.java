package com.example.interview.service;

import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

// @Service - Disabled in favor of AIPoweredEvaluationService
public class RuleBasedEvaluationService implements EvaluationService {

    @Override
    public double scoreAnswer(String sample, String response) {
        Set<String> keywords = extractKeywords(sample);
        int matched = countKeywordsInResponse(keywords, response);
        double keywordScore = (double) matched / keywords.size();
        double lengthScore = Math.min(response.length(), 500) / 500.0;
        return 0.7 * keywordScore + 0.3 * lengthScore;
    }

    @Override
    public String feedbackFor(String sample, String response) {
        Set<String> keywords = extractKeywords(sample);
        List<String> missed = keywords.stream()
                .filter(k -> !response.toLowerCase().contains(k))
                .collect(Collectors.toList());

        if (missed.isEmpty())
            return "Excellent! You covered all key points.";
        if (missed.size() < keywords.size() / 2)
            return "Good answer, but consider mentioning: " + String.join(", ", missed);
        return "Needs improvement. Focus on: " + String.join(", ", missed);
    }

    private Set<String> extractKeywords(String text) {
        return Arrays.stream(text.toLowerCase().split("\\W+"))
                .filter(w -> w.length() > 3)
                .collect(Collectors.toSet());
    }

    private int countKeywordsInResponse(Set<String> keywords, String response) {
        int count = 0;
        for (String k : keywords)
            if (response.toLowerCase().contains(k))
                count++;
        return count;
    }
}
