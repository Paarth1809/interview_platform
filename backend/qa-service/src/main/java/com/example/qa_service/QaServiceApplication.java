package com.example.qa_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {"com.example.qa_service", "com.example.interview"})
@EntityScan({"com.example.interview.model", "com.example.qa_service.model"})
@EnableJpaRepositories({"com.example.interview.repo", "com.example.qa_service.repository"})
public class QaServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(QaServiceApplication.class, args);
	}

}
