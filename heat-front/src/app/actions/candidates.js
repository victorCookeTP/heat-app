export const fetchCandidatesWithResults = async (token) => {
  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/candidates/results",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      console.error("Error fetching students:", res.status);
      return null;
    }
  } catch (error) {
    console.error("Error fetching students:", error);
    return null;
  }
};

export const createCandidate = async (newStudent, token) => {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/candidates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newStudent),
    });

    if (res.ok) {
      const student = await res.json();
      return student;
    } else {
      const errorData = await res.json();
      console.error("Error creating student:", res.status, errorData.error);
      return { error: errorData.error };
    }
  } catch (error) {
    console.error("Error creating student:", error);
    return null;
  }
};

export const deleteCandidate = async (candidateId, token) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/candidates/${candidateId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.ok) {
      const result = await res.json();
      return result;
    } else {
      console.error("Error deleting student:", res.status);
      return null;
    }
  } catch (error) {
    console.error("Error deleting student:", error);
    return null;
  }
};

export const sendTestLink = async (student, token) => {
  const testLink = `${window.location.origin}/start?candidateId=${student.uuid}`;
  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/candidates/send-link",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: student.email,
          testLink,
          candidateId: student.uuid,
        }),
      }
    );

    if (res.ok) {
      return `Test link sent to ${student.email}`;
    } else {
      console.error("Error sending test link:", res.status);
    }
  } catch (error) {
    console.error("Error sending test link:", error);
  }
};

export const sendResults = async (student, token) => {
  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/candidates/send-results",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: student.email,
          testScore: student.testScore,
          audioScore: student.audioScore,
          finalResult: student.finalResult,
        }),
      }
    );

    if (res.ok) {
      return `Test results sent to ${student.email}`;
    } else {
      console.error("Error sending results:", res.status);
    }
  } catch (error) {
    console.error("Error sending results:", error);
  }
};
