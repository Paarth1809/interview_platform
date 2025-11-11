package com.example.interview.repo;

import com.example.interview.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByTopicAndDifficulty(String topic, String difficulty);
}
