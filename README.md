AI-Powered Interview Preparation Platform

A full-stack platform that simulates technical interviews using AI-based evaluation, question banks, scoring, and detailed feedback.
Built using Spring Boot, FastAPI, React, and supports Dockerized deployment.

🚀 Features

Topic & difficulty-based interview creation

AI-generated scoring

Semantic similarity

Keyword coverage

Sentiment analysis

Detailed answer feedback

JWT authentication

React modern UI

Microservice architecture

Optional Docker deployment

📂 Project Structure
project/
│── backend/
│   ├── qa-service/          # Spring Boot backend
│   └── ai-eval-service/     # Python AI microservice
│
│── frontend/                # React frontend (Vite)
│
│── docker-compose.yml
│── README.md

🧠 Tech Stack
Backend (Java)

Spring Boot 3

Spring Security (JWT)

Spring Data JPA

PostgreSQL / H2

AI Microservice

FastAPI

Python

NLP models / OpenAI API

Frontend

React

Vite

Axios

DevOps

Docker

Docker Compose

GitHub Actions

🛠 Setup
Clone repo
git clone https://github.com/Paarth1809/interview_platform.git
cd interview_platform

QA Service (Spring Boot)
cd backend/qa-service
./mvnw spring-boot:run

AI Service (FastAPI)
cd backend/ai-eval-service
pip install -r requirements.txt
uvicorn app:app --reload --port 8001

Frontend
cd frontend
npm install
npm run dev

🐳 Run with Docker
docker compose up --build


Starts:

qa-service (Spring Boot)

ai-eval-service (FastAPI)

frontend (React UI)

📌 APIs
Interview

POST /api/interviews – start

POST /api/interviews/{id}/answers – submit answers

AI Engine

POST /evaluate

Auth

POST /auth/register

POST /auth/login

⭐ Support

Star ⭐ the repo if you like it.
