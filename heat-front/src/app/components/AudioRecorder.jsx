"use client";

import { useState, useRef, useEffect } from "react";
import Recorder from "recorder-js";
import { uploadAudio, submitFinalEvaluation } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function AudioRecorder() {
  const [recording, setRecording] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  const [candidateId, setCandidateId] = useState(null);
  const [testScore, setTestScore] = useState(null);
  const recorderRef = useRef(null);
  const router = useRouter();

  // console.log(candidateId);
  // console.log(testScore);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const candidateIdFromUrl = urlParams.get("candidateId");
    const testScoreFromUrl = urlParams.get("testScore");

    if (candidateIdFromUrl && testScoreFromUrl) {
      setCandidateId(candidateIdFromUrl);
      setTestScore(testScoreFromUrl);
    } else {
      console.error("candidateId o testScore no encontrados en la URL");
    }
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { channelCount: 1 },
      });
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)({
        sampleRate: 22050,
      });
      const recorder = new Recorder(audioContext);
      recorderRef.current = recorder;

      await recorder.init(stream);
      recorder.start();
      setRecording(true);
    } catch (error) {
      console.error("Error al acceder al micrófono:", error);
    }
  };

  const stopRecording = async () => {
    if (recorderRef.current) {
      const { blob } = await recorderRef.current.stop();
      const file = new File([blob], "recording.wav", { type: "audio/wav" });
      setAudioFile(file);
      setRecording(false);
    }
  };

  const handleUpload = async () => {
    if (audioFile) {
      try {
        const audioEvaluation = await uploadAudio(audioFile);
        const audioScore = audioEvaluation || 0;

        await submitFinalEvaluation({
          candidateId,
          testScore,
          audioScore,
        });

        router.push("/thank-you");
      } catch (error) {
        console.error("Error al subir el audio:", error);
      }
    } else {
      console.error("No hay archivo de audio disponible para subir.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-6">Pronunciation Test</h1>
      <p className="mb-4 text-lg text-center">
        Read the following sentence: "The quick brown fox jumps over the lazy
        dog." Once you are done, press Stop and Upload.
      </p>
      {recording ? (
        <button
          onClick={stopRecording}
          className="bg-red-500 text-white p-3 rounded-lg mb-4"
        >
          Stop Recording
        </button>
      ) : (
        <button
          onClick={startRecording}
          className="bg-green-500 text-white p-3 rounded-lg mb-4"
        >
          Start Recording
        </button>
      )}
      <button
        onClick={handleUpload}
        disabled={!audioFile}
        className="bg-blue-500 text-white p-3 rounded-lg"
      >
        Upload Audio
      </button>
      {evaluation && (
        <p className="mt-4 text-lg">Audio Evaluation: {evaluation}</p>
      )}
    </div>
  );
}
