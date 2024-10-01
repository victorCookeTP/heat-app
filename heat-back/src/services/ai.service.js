const axios = require("axios");
const { GoogleAuth } = require("google-auth-library");
const fs = require("fs");
const sdk = require("microsoft-cognitiveservices-speech-sdk");

// Verificar que la variable de entorno esté configurada correctamente
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  throw new Error("El cuestionario no esta disponible, intenta mas tarde.");
}

const generateQuestions = async () => {
  const projectId = process.env.GOOGLE_PROJECT_ID;
  const location = "us-central1";
  const model = "text-bison";

  const auth = new GoogleAuth({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  });

  const accessToken = await auth.getAccessToken();
  const url = `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${model}:predict`;

  const prompt = `
  Generate 3 English grammar multiple-choice questions in the following format:
  
  **Question1**{here comes the question1}**OPTIONS**(A){Option A}**(B){Option B}**(C){Option C}**(D){OptionD}**Answer1{correct answer}**Question2**{here comes the question2}**OPTIONS**(A){Option A}**(B){Option B}**(C){Option C}**(D){OptionD}**Answer2{correct answer}**Question3**{here comes the question}**OPTIONS**(A){Option A}**(B){Option B}**(C){Option C}**(D){OptionD}**Answer3{correct answer}**
  

  Make sure each question follows this exact format.
  `;

  const requestBody = {
    instances: [{ prompt }],
    parameters: {
      temperature: 0.9,
      maxOutputTokens: 512,
      topK: 20,
      topP: 0.95,
    },
  };

  try {
    const response = await axios.post(url, requestBody, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    console.log(response.data.predictions[0]);
    return response.data.predictions[0];
  } catch (error) {
    console.error("Error generating questions with Vertex AI:", error.message);
    throw new Error("Question generation failed.");
  }
};

const calculateAverageAccuracyScore = (evaluationResult) => {
  let wordTotalScore = 0;
  let wordCount = 0;

  let phonemeTotalScore = 0;
  let phonemeCount = 0;

  let syllableTotalScore = 0;
  let syllableCount = 0;

  if (evaluationResult.NBest && evaluationResult.NBest.length > 0) {
    evaluationResult.NBest[0].Words?.forEach((wordData) => {
      if (wordData.PronunciationAssessment) {
        wordTotalScore += wordData.PronunciationAssessment.AccuracyScore;
        wordCount++;
      }

      if (wordData.Syllables) {
        wordData.Syllables.forEach((syllableData) => {
          if (syllableData.PronunciationAssessment) {
            syllableTotalScore +=
              syllableData.PronunciationAssessment.AccuracyScore;
            syllableCount++;
          }
        });
      }

      if (wordData.Phonemes) {
        wordData.Phonemes.forEach((phonemeData) => {
          if (phonemeData.PronunciationAssessment) {
            phonemeTotalScore +=
              phonemeData.PronunciationAssessment.AccuracyScore;
            phonemeCount++;
          }
        });
      }
    });
  } else {
    console.error("El resultado de NBest no está disponible o está vacío.");
    return 0;
  }

  const wordAverage = wordCount > 0 ? wordTotalScore / wordCount : 0;
  const phonemeAverage =
    phonemeCount > 0 ? phonemeTotalScore / phonemeCount : 0;
  const syllableAverage =
    syllableCount > 0 ? syllableTotalScore / syllableCount : 0;

  const finalAverage = (wordAverage + phonemeAverage + syllableAverage) / 3;
  console.log(finalAverage);
  return finalAverage;
};

const evaluateAudio = async (audioFilePath) => {
  const audioData = fs.readFileSync(audioFilePath);
  const subscriptionKey = process.env.AZURE_SPEECH_KEY;
  const region = process.env.AZURE_REGION;

  const speechConfig = sdk.SpeechConfig.fromSubscription(
    subscriptionKey,
    region
  );

  const pronunciationAssessmentConfig = new sdk.PronunciationAssessmentConfig(
    "The quick brown fox jumps over the lazy dog.",
    sdk.PronunciationAssessmentGradingSystem.HundredMark,
    sdk.PronunciationAssessmentGranularity.Phoneme,
    true
  );

  const audioConfig = sdk.AudioConfig.fromWavFileInput(audioData);
  const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

  pronunciationAssessmentConfig.applyTo(recognizer);

  return new Promise((resolve, reject) => {
    recognizer.recognizeOnceAsync((result) => {
      if (result.reason === sdk.ResultReason.RecognizedSpeech) {
        const evaluationResult = JSON.parse(
          result.properties.getProperty(
            sdk.PropertyId.SpeechServiceResponse_JsonResult
          )
        );

        resolve(evaluationResult);
        console.log(evaluationResult);
      } else {
        reject("No se pudo reconocer el audio.");
      }
    });
  }).then((evaluationResult) => {
    const audioScore = calculateAverageAccuracyScore(evaluationResult);
    return audioScore;
  });
};

const evaluateTest = (userAnswers, correctAnswers) => {
  const correctCount = correctAnswers.reduce(
    (acc, correct, index) => acc + (userAnswers[index] === correct ? 1 : 0),
    0
  );
  const score = (correctCount / correctAnswers.length) * 100;
  return score;
};

module.exports = {
  generateQuestions,
  evaluateAudio,
  evaluateTest,
};
