package com.example.interview.dto;

import java.util.List;

public record InterviewDTO(Long interviewId, List<QuestionDTO> questions) {}
