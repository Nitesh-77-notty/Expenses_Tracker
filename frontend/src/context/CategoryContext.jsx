import React, { createContext, useContext, useState, useEffect } from "react";
import * as categoryApi from "../services/categoryApi";
import { useAuth } from "./AuthContext";

const CategoryContext = createContext(null);

export const CategoryProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await categoryApi.getCategories();
      if (res.success) {
        setCategories(res.data);
        setError(null);
      }
    } catch (err) {
      setError(err.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCategories();
    } else {
      setCategories([]);
    }
  }, [isAuthenticated]);

  const addCategory = async (categoryData) => {
    try {
      const res = await categoryApi.createCategory(categoryData);
      if (res.success) {
        setCategories((prev) => [res.data, ...prev]);
        return res;
      }
    } catch (err) {
      throw err;
    }
  };

  const updateCategory = async (id, categoryData) => {
    try {
      const res = await categoryApi.updateCategory(id, categoryData);
      if (res.success) {
        setCategories((prev) =>
          prev.map((c) => (c._id === id ? res.data : c))
        );
        return res;
      }
    } catch (err) {
      throw err;
    }
  };

  const deleteCategory = async (id) => {
    try {
      const res = await categoryApi.deleteCategory(id);
      if (res.success) {
        setCategories((prev) => prev.filter((c) => c._id !== id));
        return res;
      }
    } catch (err) {
      throw err;
    }
  };

  return (
    <CategoryContext.Provider
      value={{
        categories,
        loading,
        error,
        fetchCategories,
        addCategory,
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategories must be used within a CategoryProvider");
  }
  return context;
};
