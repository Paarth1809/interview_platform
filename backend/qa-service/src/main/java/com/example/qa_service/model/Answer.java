package com.example.qa_service.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Answer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int questionId;

    @Column(columnDefinition = "TEXT")
    private String candidateResponse;

    private double score;
    private double keywordCoverage;
    private double semanticSimilarity;

    private String sentiment;

    @Column(columnDefinition = "TEXT")
    private String feedback;
}
