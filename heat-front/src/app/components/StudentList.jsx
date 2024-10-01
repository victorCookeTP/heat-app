import StudentItem from "./StudentItem";

export default function StudentList({
  students,
  handleSendTestLink,
  handleSendResults,
  handleDeleteStudent,
}) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-200 text-gray-600 text-left">
            <th className="py-3 px-6 font-medium uppercase">Name</th>
            <th className="py-3 px-6 font-medium uppercase">Scores</th>
            <th className="py-3 px-6 font-medium uppercase">Status</th>
            <th className="py-3 px-6 font-medium uppercase">User</th>
            <th className="py-3 px-6 font-medium uppercase">Action</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-4 text-gray-500">
                No students match the selected filters.
              </td>
            </tr>
          ) : (
            students.map((student) => (
              <StudentItem
                key={student.uuid}
                student={student}
                handleSendTestLink={handleSendTestLink}
                handleSendResults={handleSendResults}
                handleDeleteStudent={handleDeleteStudent}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
