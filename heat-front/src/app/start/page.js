"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function StartTest() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null);
  const router = useRouter();
  const [candidateId, setCandidateId] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const candidateIdFromUrl = urlParams.get("candidateId");

    if (candidateIdFromUrl) {
      setCandidateId(candidateIdFromUrl);
      checkCandidateStatus(candidateIdFromUrl);
    } else {
      console.error("No se encontró candidateId en la URL.");
    }
  }, []);

  const checkCandidateStatus = async (candidateId) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/candidates/status/${candidateId}`
      );
      const data = await res.json();

      if (data.status === "complete") {
        setMessage(data.message);
      } else if (data.status === "pending") {
        router.push(`/upload-audio?candidateId=${candidateId}`);
      } else {
        router.push(`/questions?candidateId=${candidateId}`);
      }
    } catch (error) {
      console.error("Error al verificar el estado del candidato:", error);
      setMessage("Hubo un error al verificar el estado del test.");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-blue-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">Estado del Test</h1>
        <p className="mb-4 text-lg">{message}</p>
      </div>
    </div>
  );
}
