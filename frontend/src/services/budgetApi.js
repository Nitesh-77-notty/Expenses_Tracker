import request from "./api";

export const getBudgets = async (year) => {
  const query = year ? `?year=${year}` : "";
  return request(`/budgets${query}`, {
    method: "GET",
  });
};

export const getBudgetByMonth = async (month, year) => {
  return request(`/budgets/month?month=${month}&year=${year}`, {
    method: "GET",
  });
};

export const createBudget = async (data) => {
  return request("/budgets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

export const updateBudget = async (id, data) => {
  return request(`/budgets/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

export const deleteBudget = async (id) => {
  return request(`/budgets/${id}`, {
    method: "DELETE",
  });
};
