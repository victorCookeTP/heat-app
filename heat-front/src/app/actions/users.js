export const fetchDashboardData = async (token) => {
  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/users/dashboard",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.status === 401 || res.status === 403) {
      return { error: "Unauthorized" };
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return null;
  }
};
