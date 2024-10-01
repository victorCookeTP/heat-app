export const fetchQuestions = async () => {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/ai/questions");
  if (!res.ok) throw new Error("Error al obtener las preguntas");
  const data = await res.json();
  console.log(data);

  return data;
};

export const uploadAudio = async (audioFile) => {
  const formData = new FormData();
  formData.append("audio", audioFile);

  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/ai/upload-audio",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Error al subir el audio");
    }

    return await response.json();
  } catch (error) {
    console.error("Error uploading audio:", error);
    throw error;
  }
};

export const submitTest = async (answers) => {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/ai/submit-test", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(answers),
  });

  if (!res.ok) throw new Error("Error al enviar la evaluacion de preguntas");
  return await res.json();
};

export const submitFinalEvaluation = async (finalEvaluationData) => {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/ai/final-evaluation",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalEvaluationData),
      }
    );

    if (!response.ok) {
      throw new Error("Error al enviar la evaluación final");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error al enviar la evaluación final:", error);
    throw error;
  }
};
