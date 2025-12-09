import React, { useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";


export default function RecordUpload() {
  const mediaRecorderRef = useRef(null);
  const [chunks, setChunks] = useState([]);
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState(null);
  const [result, setResult] = useState(null);
  const waveformRef = useRef(null);
  const waveSurferRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function start() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.ondataavailable = (e) =>
      setChunks((prev) => [...prev, e.data]);
    mediaRecorderRef.current.start();
    setRecording(true);
    setChunks([]);
  }

  function stop() {
    return new Promise((resolve) => {
      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        // Create waveform preview
        const url = URL.createObjectURL(blob);

        if (!waveSurferRef.current) {
          waveSurferRef.current = WaveSurfer.create({
            container: waveformRef.current,
            waveColor: "gray",
            progressColor: "blue",
            height: 80
          });
        }

        waveSurferRef.current.load(url);

        const fd = new FormData();
        fd.append("audio", blob, "response.webm");

        setLoading(true);
        setError(null);

        const resp = await fetch("http://localhost:3000/api/submit-audio", {
          method: "POST",
          body: fd,
        });

        const data = await resp.json();
        setLoading(false);

        if (!data.transcript) {
          setError("No speech detected. Try again.");
          return;
        }

        setTranscript(data.transcript);
        setResult(data.evaluation);
        resolve();
      };

      mediaRecorderRef.current.stop();
      setRecording(false);
    });
  }

  return (
    <div className="page-container">
      <div className="card" style={{ maxWidth: '760px', margin: '0 auto' }}>
        <h2 className="text-2xl font-bold mb-4">Record Response</h2>
        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          <button className="btn-primary" onClick={start} disabled={recording}>
            {recording ? "Recording..." : "Start Recording"}
          </button>
          <button className="btn-secondary" onClick={stop} disabled={!recording}>
            Stop & Upload
          </button>
        </div>

        <div ref={waveformRef} style={{ marginBottom: '1.5rem' }} />

        {loading && <p className="text-muted">Processing your audio...</p>}
        {error && <p style={{ color: "#ef4444" }}>{error}</p>}

        {transcript && (
          <div className="mb-8">
            <h4 className="text-xl font-bold mb-2">Transcript</h4>
            <div className="p-4 bg-black/20 rounded-lg text-muted">
              {transcript}
            </div>
          </div>
        )}

        {result && (
          <div>
            <h4 className="text-xl font-bold mb-2">AI Evaluation</h4>
            <div className="p-4 bg-black/20 rounded-lg">
              <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
