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

    public InterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
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
        Map<String, Object> result = interviewService.submitAnswers(id, answers);
        return ResponseEntity.ok(result);
    }

    // Get interview report
    @GetMapping("/{id}/report")
    public ResponseEntity<?> getReport(@PathVariable("id") Long id) {
        Map<String, Object> report = interviewService.getReport(id);
        return ResponseEntity.ok(report);
    }
}
