import request from "./api";

export const getCategories = async (isDefault) => {
  const query = isDefault !== undefined ? `?isDefault=${isDefault}` : "";
  return request(`/categories${query}`, {
    method: "GET",
  });
};

export const createCategory = async (data) => {
  return request("/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

export const updateCategory = async (id, data) => {
  return request(`/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

export const deleteCategory = async (id) => {
  return request(`/categories/${id}`, {
    method: "DELETE",
  });
};
