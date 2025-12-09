---
description: Start the entire backend stack (Java, Node, Python)
---

# Start Backend Services

This project requires three backend services to be running simultaneously:

### 1. Prerequisites
- **PostgreSQL**: Must be running on port `5432`.
  - Database: `interviewdb`
  - User: `postgres`
  - Password: `Light1817`
- **MongoDB**: Must be running on port `27017`.

### 2. Start Java Spring Boot Service (Core Backend)
This service handles interviews, questions, and reports.
```powershell
cd "backend/qa-service"
./mvnw.cmd spring-boot:run
```

### 3. Start Python AI Service (Evaluation Engine)
This service performs AI analysis of answers.
```powershell
cd "backend/ai-eval-service"
# Ensure venv is active if you have one, or just run with python
python -m uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

### 4. Start Node.js Service (Audio/Uploads)
This service handles audio upload and transcription.
```powershell
cd "backend"
node server.js
```
