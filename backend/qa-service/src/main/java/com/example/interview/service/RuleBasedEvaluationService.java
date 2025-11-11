package com.example.interview.service;

import org.springframework.stereotype.Service;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class RuleBasedEvaluationService implements EvaluationService {

    private static final Pattern WORD_SPLIT = Pattern.compile("\\W+");

    private Set<String> extractKeywords(String sample) {
        if (sample == null) return Set.of();
        return Arrays.stream(WORD_SPLIT.split(sample.toLowerCase()))
                .filter(w -> w.length() > 2)
                .collect(Collectors.toSet());
    }

    @Override
    public double scoreAnswer(String sampleAnswer, String response) {
        Set<String> keywords = extractKeywords(sampleAnswer);
        if (keywords.isEmpty()) return 0;

        Set<String> responseWords = Arrays.stream(WORD_SPLIT.split(
                response == null ? "" : response.toLowerCase()))
                .filter(w -> w.length() > 2)
                .collect(Collectors.toSet());

        long matched = keywords.stream().filter(responseWords::contains).count();
        double keywordScore = (double) matched / keywords.size();
        double lengthScore = Math.min((response == null ? 0 : response.length()), 500) / 500.0;

        return 0.7 * keywordScore + 0.3 * lengthScore;
    }

    @Override
    public String feedbackFor(String sampleAnswer, String response) {
        Set<String> keywords = extractKeywords(sampleAnswer);
        Set<String> responseWords = Arrays.stream(WORD_SPLIT.split(
                response == null ? "" : response.toLowerCase()))
                .filter(w -> w.length() > 2)
                .collect(Collectors.toSet());

        List<String> matched = keywords.stream().filter(responseWords::contains).limit(10).toList();
        return "Matched keywords: " + String.join(", ", matched);
    }
}
