"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  fetchCandidatesWithResults,
  createCandidate,
  sendTestLink,
  sendResults,
  deleteCandidate,
} from "../actions/candidates";
import { fetchDashboardData } from "../actions/users";
import FilterSection from "./FilterSection";
import StudentList from "./StudentList";
import Modal from "./Modal"; // Modal importado

export default function Dashboard() {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [selectedUser, setSelectedUser] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado del modal
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setStudents([]);
    router.push("/");
  };

  useEffect(() => {
    const fetchStudents = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }

      const data = await fetchCandidatesWithResults(token);

      if (data) {
        setStudents(
          data.map((student) => ({
            ...student,
            reminder: student.reminder !== null ? student.reminder : null,
          }))
        );
      }
    };

    fetchStudents();
  }, [router]);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }

      const data = await fetchDashboardData(token);
      if (data?.error === "Unauthorized") {
        router.push("/");
      }
    };

    checkAuth();
  }, [router]);

  const handleInputChange = (e) => {
    setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const student = await createCandidate(newStudent, token);

    if (student?.error) {
      alert(student.error);
    } else if (student) {
      setStudents([...students, { ...student, reminder: false }]);
      setNewStudent({ firstName: "", lastName: "", email: "" });
      setIsModalOpen(false); // Cierra el modal después de crear un estudiante
    }
  };

  const handleDeleteStudent = async (studentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student and all associated data?"
    );
    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem("token");
    const result = await deleteCandidate(studentId, token);

    if (result) {
      alert("Student deleted successfully");

      setStudents(students.filter((student) => student.uuid !== studentId));
    } else {
      alert("Error deleting student");
    }
  };

  const handleSendTestLink = async (student) => {
    const token = localStorage.getItem("token");
    const message = await sendTestLink(student, token);
    if (message) {
      alert(message);

      setStudents((prevStudents) =>
        prevStudents.map((s) =>
          s.uuid === student.uuid ? { ...s, reminder: true } : s
        )
      );
    }
  };

  const handleSendResults = async (student) => {
    const token = localStorage.getItem("token");
    const message = await sendResults(student, token);
    if (message) {
      alert(message);
    }
  };

  // Filtros
  const filteredStudents = students.filter((student) => {
    const userMatch = selectedUser === "All" || student.userId === selectedUser;
    const statusMatch =
      selectedStatus === "All" || student.status === selectedStatus;
    return userMatch && statusMatch;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* NAV Responsive */}
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-white text-2xl">User Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mt-4 md:mt-0"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Contenido del dashboard */}
      <div className="container mx-auto p-4 md:p-8">
        <h2 className="text-3xl font-bold mb-6">Student List</h2>

        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <FilterSection
            selectedUser={selectedUser}
            selectedStatus={selectedStatus}
            students={students}
            setSelectedUser={setSelectedUser}
            setSelectedStatus={setSelectedStatus}
          />

          <button
            onClick={() => setIsModalOpen(true)} // Abrir modal
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-4 md:mt-0"
          >
            Create Student
          </button>
        </div>

        {/* Tabla responsive */}
        <div className="overflow-x-auto">
          <StudentList
            students={filteredStudents}
            handleSendTestLink={handleSendTestLink}
            handleSendResults={handleSendResults}
            handleDeleteStudent={handleDeleteStudent}
          />
        </div>
      </div>

      {/* Modal para crear estudiantes */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleCreateStudent}>
          <div className="grid grid-cols-1 gap-4">
            <input
              type="text"
              name="firstName"
              value={newStudent.firstName}
              onChange={handleInputChange}
              placeholder="First Name"
              className="p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              name="lastName"
              value={newStudent.lastName}
              onChange={handleInputChange}
              placeholder="Last Name"
              className="p-2 border border-gray-300 rounded"
            />
            <input
              type="email"
              name="email"
              value={newStudent.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="p-2 border border-gray-300 rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
          >
            Create Student
          </button>
        </form>
      </Modal>
    </div>
  );
}

// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import {
//   fetchCandidatesWithResults,
//   createCandidate,
//   sendTestLink,
//   sendResults,
//   deleteCandidate,
// } from "../actions/candidates";
// import { fetchDashboardData } from "../actions/users";
// import FilterSection from "./FilterSection";
// import StudentList from "./StudentList";
// import Modal from "./Modal";

// export default function Dashboard() {
//   const [students, setStudents] = useState([]);
//   const [newStudent, setNewStudent] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//   });
//   const [selectedUser, setSelectedUser] = useState("All");
//   const [selectedStatus, setSelectedStatus] = useState("All");
//   const [isModalOpen, setIsModalOpen] = useState(false); // Estado para el modal
//   const router = useRouter();

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     setStudents([]);
//     router.push("/");
//   };

//   useEffect(() => {
//     const fetchStudents = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         router.push("/");
//         return;
//       }

//       const data = await fetchCandidatesWithResults(token);

//       if (data) {
//         setStudents(
//           data.map((student) => ({
//             ...student,
//             reminder: student.reminder !== null ? student.reminder : null,
//           }))
//         );
//       }
//     };

//     fetchStudents();
//   }, [router]);

//   useEffect(() => {
//     const checkAuth = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         router.push("/");
//         return;
//       }

//       const data = await fetchDashboardData(token);
//       if (data?.error === "Unauthorized") {
//         router.push("/");
//       }
//     };

//     checkAuth();
//   }, [router]);

//   const handleInputChange = (e) => {
//     setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
//   };

//   const handleCreateStudent = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem("token");

//     const student = await createCandidate(newStudent, token);

//     if (student?.error) {
//       alert(student.error);
//     } else if (student) {
//       setStudents([...students, { ...student, reminder: false }]);
//       setNewStudent({ firstName: "", lastName: "", email: "" });
//       setIsModalOpen(false);
//     }
//   };

//   const handleDeleteStudent = async (studentId) => {
//     const confirmed = window.confirm(
//       "Are you sure you want to delete this student and all associated data?"
//     );
//     if (!confirmed) {
//       return;
//     }

//     const token = localStorage.getItem("token");
//     const result = await deleteCandidate(studentId, token);

//     if (result) {
//       alert("Student deleted successfully");

//       setStudents(students.filter((student) => student.uuid !== studentId));
//     } else {
//       alert("Error deleting student");
//     }
//   };

//   const handleSendTestLink = async (student) => {
//     const token = localStorage.getItem("token");
//     const message = await sendTestLink(student, token);
//     if (message) {
//       alert(message);

//       setStudents((prevStudents) =>
//         prevStudents.map((s) =>
//           s.uuid === student.uuid ? { ...s, reminder: true } : s
//         )
//       );
//     }
//   };

//   const handleSendResults = async (student) => {
//     const token = localStorage.getItem("token");
//     const message = await sendResults(student, token);
//     if (message) {
//       alert(message);
//     }
//   };

//   // Filtros
//   const filteredStudents = students.filter((student) => {
//     const userMatch = selectedUser === "All" || student.userId === selectedUser;
//     const statusMatch =
//       selectedStatus === "All" || student.status === selectedStatus;
//     return userMatch && statusMatch;
//   });

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <nav className="bg-gray-800 p-4">
//         <div className="container mx-auto flex justify-between">
//           <h1 className="text-white text-2xl">User Dashboard</h1>
//           <button
//             onClick={handleLogout}
//             className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
//           >
//             Logout
//           </button>
//         </div>
//       </nav>

//       <div className="container mx-auto p-8">
//         <h2 className="text-3xl font-bold mb-6">Student List</h2>

//         <div className="flex justify-between items-center mb-6">
//           <FilterSection
//             selectedUser={selectedUser}
//             selectedStatus={selectedStatus}
//             students={students}
//             setSelectedUser={setSelectedUser}
//             setSelectedStatus={setSelectedStatus}
//           />

//           <button
//             onClick={() => setIsModalOpen(true)} // Abrir modal
//             className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
//           >
//             Create Student
//           </button>
//         </div>

//         <StudentList
//           students={filteredStudents}
//           handleSendTestLink={handleSendTestLink}
//           handleSendResults={handleSendResults}
//           handleDeleteStudent={handleDeleteStudent}
//         />
//       </div>

//       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
//         <form onSubmit={handleCreateStudent}>
//           <div className="grid grid-cols-1 gap-4">
//             <input
//               type="text"
//               name="firstName"
//               value={newStudent.firstName}
//               onChange={handleInputChange}
//               placeholder="First Name"
//               className="p-2 border border-gray-300 rounded"
//             />
//             <input
//               type="text"
//               name="lastName"
//               value={newStudent.lastName}
//               onChange={handleInputChange}
//               placeholder="Last Name"
//               className="p-2 border border-gray-300 rounded"
//             />
//             <input
//               type="email"
//               name="email"
//               value={newStudent.email}
//               onChange={handleInputChange}
//               placeholder="Email"
//               className="p-2 border border-gray-300 rounded"
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
//           >
//             Create Student
//           </button>
//         </form>
//       </Modal>
//     </div>
//   );
// }
