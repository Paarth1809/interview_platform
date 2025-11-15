package com.example.qa_service.controller;

import com.example.qa_service.model.Answer;
import com.example.qa_service.service.AIEvaluationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/answers")
public class AnswerController {

    @Autowired
    private AIEvaluationService aiService;

    @PostMapping("/submit")
    public Answer submitAnswer(@RequestBody Map<String, Object> body) {

        int questionId = (int) body.get("questionId");
        String questionText = body.get("questionText").toString();
        String sampleAnswer = body.get("sampleAnswer").toString();
        String candidateResponse = body.get("candidateResponse").toString();

        return aiService.evaluateAndSave(
                questionId,
                questionText,
                sampleAnswer,
                candidateResponse
        );
    }
}
