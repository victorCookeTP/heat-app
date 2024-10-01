export default function StudentItem({
  student,
  handleSendTestLink,
  handleSendResults,
  handleDeleteStudent,
}) {
  return (
    <tr className="border-b">
      <td className="py-4 px-6">
        {student.firstName} {student.lastName}
      </td>
      <td className="py-4 px-6">
        {student.finalResult
          ? `${student.finalResult} (${parseFloat(
              student.testScore || 0
            ).toFixed(1)}% / ${parseFloat(student.audioScore || 0).toFixed(
              1
            )}%)`
          : "No test score yet"}
      </td>
      <td className="py-4 px-6">{student.status || "None"}</td>
      <td className="py-4 px-6">
        {student.userFirstName && student.userLastName
          ? `${student.userFirstName} ${student.userLastName}`
          : "No User Available"}
      </td>
      <td className="py-4 px-6">
        {student.finalResult ? (
          <button
            onClick={() => handleSendResults(student)}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Send Results
          </button>
        ) : (
          <button
            onClick={() => handleSendTestLink(student)}
            className={`p-2 rounded ${
              student.reminder
                ? "bg-yellow-500 text-white"
                : "bg-green-500 text-white"
            }`}
          >
            {student.reminder ? "Resend Email Link" : "Send Test Link"}
          </button>
        )}

        <button
          onClick={() => handleDeleteStudent(student.uuid)}
          className="bg-red-500 text-white p-2 rounded ml-4"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
