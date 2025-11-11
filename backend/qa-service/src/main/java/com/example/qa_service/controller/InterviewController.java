package com.example.qa_service.controller;

import com.example.interview.dto.*;
import com.example.interview.model.Interview;
import com.example.interview.service.InterviewService;
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

    // Start an interview: body { "topic":"Java", "difficulty":"Intermediate", "n":"3" }
    @PostMapping
    public ResponseEntity<InterviewDTO> startInterview(@RequestBody Map<String, String> body) {
        String topic = body.get("topic");
        String difficulty = body.get("difficulty");
        int n = body.containsKey("n") ? Integer.parseInt(body.get("n")) : 3;
        InterviewDTO dto = interviewService.createInterview(topic, difficulty, n);
        return ResponseEntity.ok(dto);
    }

    // Submit answers: list of AnswerDTO
    @PostMapping("/{id}/answers")
    public ResponseEntity<?> submitAnswers(@PathVariable("id") Long id,
                                           @RequestBody List<AnswerDTO> answers) {
        Interview interview = interviewService.submitAnswers(id, answers);

        var result = Map.of(
            "interviewId", interview.getId(),
            "score", interview.getScore(),
            "answers", interview.getAnswers().stream().map(a ->
                Map.of(
                    "questionId", a.getQuestionId(),
                    "score", a.getScore(),
                    "feedback", a.getFeedback()
                )
            ).toList()
        );

        return ResponseEntity.ok(result);
    }
}
