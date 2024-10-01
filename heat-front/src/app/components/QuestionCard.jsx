export default function QuestionCard({
  question,
  options,
  questionNumber,
  onAnswerSelected,
}) {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-full sm:max-w-lg text-center">
      <h2 className="text-xl font-bold mb-4">Question {questionNumber}</h2>
      <p className="text-lg mb-4">{question}</p>
      <div className="space-y-4">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswerSelected(option)}
            className="block w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
