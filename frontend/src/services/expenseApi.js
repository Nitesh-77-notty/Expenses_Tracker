import request from "./api";

export const getExpenses = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.page) query.append("page", params.page);
  if (params.limit) query.append("limit", params.limit);
  if (params.categoryId) query.append("categoryId", params.categoryId);
  if (params.startDate) query.append("startDate", params.startDate);
  if (params.endDate) query.append("endDate", params.endDate);
  if (params.search) query.append("search", params.search);

  const queryString = query.toString() ? `?${query.toString()}` : "";
  return request(`/expenses${queryString}`, {
    method: "GET",
  });
};

export const createExpense = async (data) => {
  return request("/expenses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

export const updateExpense = async (id, data) => {
  return request(`/expenses/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

export const deleteExpense = async (id) => {
  return request(`/expenses/${id}`, {
    method: "DELETE",
  });
};
