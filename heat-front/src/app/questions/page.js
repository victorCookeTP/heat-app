"use client";

import { parseQuestions } from "@/lib/questionParser";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import QuestionCard from "../components/QuestionCard";
import { fetchQuestions, submitFinalEvaluation } from "@/lib/api";

export default function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [testScore, setTestScore] = useState(null);
  const [candidateId, setCandidateId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const candidateIdFromUrl = urlParams.get("candidateId");

    if (candidateIdFromUrl) {
      setCandidateId(candidateIdFromUrl);
    } else {
      console.error("No candidateId found in URL");
    }
  }, []);

  useEffect(() => {
    const getQuestions = async () => {
      try {
        const data = await fetchQuestions();

        const parsedQuestions = parseQuestions(data.questions);

        setQuestions(parsedQuestions);

        const correctAns = parsedQuestions.map((q) => q.correctAnswer);
        setCorrectAnswers(correctAns);
      } catch (error) {
        console.error("Error al obtener las preguntas:", error);
      }
    };
    getQuestions();
  }, []);

  const handleAnswer = (answer) => {
    const answerLetter = answer.match(/\((.)\)/)[1];

    setAnswers([...answers, answerLetter]);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      submitAnswers();
    }
  };

  const submitAnswers = async () => {
    try {
      let score = 0;
      answers.forEach((answer, index) => {
        if (answer === correctAnswers[index]) {
          score++;
        }
      });

      const testScore = (score / correctAnswers.length) * 100;
      setTestScore(testScore);

      if (!candidateId) {
        console.error("No candidateId found");
        return;
      }

      await submitFinalEvaluation({
        candidateId,
        testScore,
        audioScore: null,
      });

      router.push(
        `/upload-audio?candidateId=${candidateId}&testScore=${testScore}`
      );
    } catch (error) {
      console.error("Error al enviar las respuestas:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      {questions.length > 0 ? (
        <QuestionCard
          question={questions[currentQuestionIndex].question}
          options={questions[currentQuestionIndex].options}
          questionNumber={currentQuestionIndex + 1}
          onAnswerSelected={handleAnswer}
        />
      ) : (
        <div>Cargando preguntas...</div>
      )}
    </div>
  );
}
