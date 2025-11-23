# AI-Powered Interview Preparation Platform

A full-stack platform that simulates technical interviews using AI-based evaluation, question banks, scoring, and detailed feedback.  
Includes a Spring Boot backend, a FastAPI AI microservice, and a React frontend. Docker Compose is provided for local development.

---

## Features

- Topic & difficulty based interview generation  
- Submit text answers and receive AI evaluation  
- Scoring: semantic similarity, keyword coverage, overall score  
- Sentiment analysis and written feedback per answer  
- JWT authentication and user flows  
- Modular microservice architecture (backend + AI service + frontend)  
- Dockerized for local development

---

## Project structure

interview_platform/
├── backend/
│ ├── qa-service/ # Spring Boot backend
│ └── ai-eval-service/ # FastAPI AI microservice
├── frontend/ # React (Vite) frontend
├── infra/ # infra / k8s (optional)
├── docker-compose.yml
└── README.md


---

## Tech stack

**Backend**
- Java 17, Spring Boot 3  
- Spring Security (JWT)  
- Spring Data JPA (H2 for dev / Postgres for prod)

**AI microservice**
- Python 3.11, FastAPI  
- Sentence-Transformers / OpenAI (configurable)  
- Uvicorn

**Frontend**
- React + Vite  
- Axios

**DevOps**
- Docker, Docker Compose  
- (Optional) Kubernetes manifests under `infra/k8s`  
- CI/CD via GitHub Actions (recommended)

---
