package com.example.interview.service;

public interface EvaluationService {
    double scoreAnswer(String sampleAnswer, String response);
    String feedbackFor(String sampleAnswer, String response);
}
