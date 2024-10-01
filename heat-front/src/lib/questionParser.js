export function parseQuestions(content) {
  const questionBlocks = content.split(/\*\*Question\d+:\*\*/).slice(1);
  return questionBlocks.map((block, index) => {
    const questionMatch = block.match(/(.*?)\*\*OPTIONS:\*\*/s);
    const questionText = questionMatch ? questionMatch[1].trim() : null;

    const optionsMatch = block.match(
      /\*\*OPTIONS:\*\*(.*?)\*\*Answer\d+:\*\*/s
    );
    const optionsText = optionsMatch ? optionsMatch[1].trim() : null;

    const answerMatch = block.match(/\*\*Answer\d+:\*\*\s*\((.)\)/);
    const correctAnswer = answerMatch ? answerMatch[1].trim() : null;

    const options = optionsText
      ? optionsText
          .split("\n")
          .map((option) => option.trim())
          .filter((option) => option)
      : [];

    return {
      question: questionText,
      options: options,
      correctAnswer: correctAnswer,
    };
  });
}
