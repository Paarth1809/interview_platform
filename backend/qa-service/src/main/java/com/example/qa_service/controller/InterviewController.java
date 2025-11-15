package com.example.qa_service.controller;

import com.example.interview.dto.*;
import com.example.interview.service.InterviewService;
import com.example.qa_service.service.AIEvaluationService;
import com.example.qa_service.model.Answer;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/interviews")
public class InterviewController {

    private final InterviewService interviewService;
    private final AIEvaluationService aiService;

    public InterviewController(InterviewService interviewService,
                               AIEvaluationService aiService) {
        this.interviewService = interviewService;
        this.aiService = aiService;
    }

    // Start interview
    @PostMapping
    public ResponseEntity<InterviewDTO> startInterview(@RequestBody Map<String, String> body) {
        String topic = body.get("topic");
        String difficulty = body.get("difficulty");
        int n = body.containsKey("n") ? Integer.parseInt(body.get("n")) : 3;
        InterviewDTO dto = interviewService.createInterview(topic, difficulty, n);
        return ResponseEntity.ok(dto);
    }

    // Submit answers + AI evaluation
    @PostMapping("/{id}/answers")
    public ResponseEntity<?> submitAnswers(@PathVariable("id") Long id,
                                           @RequestBody List<AnswerDTO> answers) {

        // Evaluate each answer using AI service
        List<Answer> evaluatedAnswers = answers.stream()
                .map(a -> aiService.evaluateAndSave(
                        a.getQuestionId(),
                        a.getQuestionText(),
                        a.getSampleAnswer(),
                        a.getCandidateResponse()
                ))
                .toList();

        // Optional: pass evaluated answers to interviewService
        Map<String, Object> result = interviewService.finishInterview(id, evaluatedAnswers);

        return ResponseEntity.ok(result);
    }
}
