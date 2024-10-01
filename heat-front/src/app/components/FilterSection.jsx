export default function FilterSection({
  selectedUser,
  selectedStatus,
  students,
  setSelectedUser,
  setSelectedStatus,
}) {
  const uniqueUsers = Array.from(
    new Map(
      students
        .filter((student) => student.userFirstName && student.userLastName)
        .map((student) => [
          student.userId,
          `${student.userFirstName} ${student.userLastName}`,
        ])
    )
  );

  return (
    <div className="flex space-x-4 mb-6">
      <select
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="All">All Users</option>
        {uniqueUsers.map(([userId, userName]) => (
          <option key={userId} value={userId}>
            {userName}
          </option>
        ))}
      </select>

      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="All">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="complete">Complete</option>
      </select>
    </div>
  );
}
