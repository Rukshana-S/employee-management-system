const API = "http://localhost:5000/api";

export const getEmployees = async () => {
  const response = await fetch(`${API}/employees`);
  return response.json();
};

export const addEmployee = async (employee) => {
  const response = await fetch(`${API}/employees`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(employee),
  });

  const data = await response.json();

  if (!response.ok) {
    throw {
      status: response.status,
      message: data.error,
    };
  }

  return data;
};