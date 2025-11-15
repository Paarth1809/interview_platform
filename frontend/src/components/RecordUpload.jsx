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
    <div>
      <button onClick={start} disabled={recording}>Record</button>
      <button onClick={stop} disabled={!recording}>Stop & Upload</button>

      {loading && <p>Processing your audio...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {transcript && (
        <div>
          <h4>Transcript</h4>
          <pre>{transcript}</pre>
        </div>
      )}

      {result && (
        <div>
          <h4>Evaluation</h4>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
