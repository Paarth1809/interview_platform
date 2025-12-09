package com.example.interview.service;

import com.example.interview.dto.*;
import com.example.interview.model.*;
import com.example.interview.repo.*;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;

@Service
public class InterviewService {

    private final QuestionRepository questionRepo;
    private final InterviewRepository interviewRepo;
    private final EvaluationService evaluator;

    public InterviewService(QuestionRepository questionRepo,
            InterviewRepository interviewRepo,
            EvaluationService evaluator) {
        this.questionRepo = questionRepo;
        this.interviewRepo = interviewRepo;
        this.evaluator = evaluator;
    }

    // create new interview
    public InterviewDTO createInterview(String topic, String difficulty, int n) {
        List<Question> pool = questionRepo.findByTopicAndDifficulty(topic, difficulty);
        Collections.shuffle(pool);

        List<Question> selected = pool.size() <= n ? pool : pool.subList(0, n);

        Interview interview = new Interview();
        interview.setTopic(topic);
        interview.setDifficulty(difficulty);
        interview.setStartedAt(Instant.now());
        interviewRepo.save(interview);

        List<QuestionDTO> questionDTOs = selected.stream()
                .map(q -> new QuestionDTO(q.getId(), q.getQuestionText()))
                .toList();

        return new InterviewDTO(interview.getId(), questionDTOs);
    }

    // submit answers + compute scores
    public Map<String, Object> submitAnswers(Long interviewId, List<AnswerDTO> answers) {
        Interview interview = interviewRepo.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Interview not found"));

        double total = 0;
        int count = 0;

        for (AnswerDTO ansDTO : answers) {
            Question q = questionRepo.findById(ansDTO.questionId()).orElse(null);
            String sample = q == null ? "" : q.getSampleAnswer();

            double score = evaluator.scoreAnswer(sample, ansDTO.responseText());
            String feedback = evaluator.feedbackFor(sample, ansDTO.responseText());

            Answer answer = new Answer();
            answer.setQuestionId(ansDTO.questionId());
            answer.setResponseText(ansDTO.responseText());
            answer.setScore(score);
            answer.setFeedback(feedback);

            interview.addAnswer(answer);
            total += score;
            count++;
        }

        interview.setFinishedAt(Instant.now());
        double finalScore = count == 0 ? 0 : total / count;
        interview.setScore(finalScore);
        interviewRepo.save(interview);

        // ✅ Create full report response
        Map<String, Object> result = new HashMap<>();
        result.put("interviewId", interviewId);
        result.put("finalScore", finalScore);

        List<Map<String, Object>> detailed = new ArrayList<>();
        for (AnswerDTO dto : answers) {
            Map<String, Object> detail = new HashMap<>();
            detail.put("questionId", dto.questionId());
            detail.put("responseText", dto.responseText());

            String feedback = evaluator.feedbackFor(
                    questionRepo.findById(dto.questionId()).get().getSampleAnswer(),
                    dto.responseText());

            detail.put("feedback", feedback);
            detailed.add(detail);
        }

        result.put("details", detailed);
        return result;
    }

    // Get interview report
    public Map<String, Object> getReport(Long interviewId) {
        Interview interview = interviewRepo.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Interview not found"));

        Map<String, Object> report = new HashMap<>();
        report.put("total_score", Math.round(interview.getScore() * 100));
        report.put("topic", interview.getTopic());
        report.put("difficulty", interview.getDifficulty());

        List<Map<String, Object>> questions = new ArrayList<>();
        for (Answer answer : interview.getAnswers()) {
            Question q = questionRepo.findById(answer.getQuestionId()).orElse(null);
            if (q != null) {
                Map<String, Object> qData = new HashMap<>();
                qData.put("question", q.getQuestionText());
                qData.put("answer", answer.getResponseText());
                qData.put("feedback", answer.getFeedback());
                qData.put("score", Math.round(answer.getScore() * 100));
                questions.add(qData);
            }
        }

        report.put("questions", questions);
        return report;
    }
}
