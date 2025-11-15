import axios from "axios";

const BASE_URL = "http://localhost:8080/api/interviews";

export async function startInterview(payload) {
  const res = await axios.post(BASE_URL, payload);
  return res.data;
}

export async function submitAnswers(interviewId, answers) {
  const res = await axios.post(`${BASE_URL}/${interviewId}/answers`, answers);
  return res.data;
}
