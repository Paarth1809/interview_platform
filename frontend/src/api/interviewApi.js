import axios from "axios";

export const javaApi = axios.create({
  baseURL: "http://localhost:8080/api",
});



export async function startInterview(payload) {
  const res = await javaApi.post("/interviews", payload);
  return res.data;
}

export async function submitAnswers(interviewId, answers) {
  const res = await javaApi.post(`/interviews/${interviewId}/answers`, answers);
  return res.data;
}

export async function getReport(interviewId) {
  // Use the endpoint that matches Backend implementation (we will add this)
  const res = await javaApi.get(`/interviews/${interviewId}/report`);
  return res.data;
}

export async function getQuestions() {
  const res = await javaApi.get("/questions");
  return res.data;
}

export async function addQuestion(text) {
  const res = await javaApi.post("/questions", { questionText: text, topic: "General", difficulty: "Medium" });
  return res.data;
}

export async function getReports() {
  // Assuming backend has this endpoint, otherwise we might need to mock or adjust
  const res = await javaApi.get("/interviews/history"); // Example endpoint
  return res.data;
}
