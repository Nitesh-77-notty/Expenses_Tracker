import React, { createContext, useContext, useState, useEffect } from "react";
import * as expenseApi from "../services/expenseApi";
import { useAuth } from "./AuthContext";

const ExpenseContext = createContext(null);

export const ExpenseProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchExpenses = async (params = {}) => {
    setLoading(true);
    try {
      const res = await expenseApi.getExpenses(params);
      if (res.success) {
        setExpenses(res.data);
        setTotalExpenses(res.total);
        setTotalPages(res.pages);
        setCurrentPage(res.page);
        setError(null);
      }
    } catch (err) {
      setError(err.message || "Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  // Helper to fetch all expenses for analytics without pagination
  const fetchAllExpenses = async (params = {}) => {
    try {
      const res = await expenseApi.getExpenses({ ...params, limit: 10000 });
      return res.success ? res.data : [];
    } catch (err) {
      console.error("Failed to load all expenses:", err);
      return [];
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchExpenses();
    } else {
      setExpenses([]);
      setTotalExpenses(0);
      setTotalPages(1);
      setCurrentPage(1);
    }
  }, [isAuthenticated]);

  const addExpense = async (expenseData) => {
    try {
      const res = await expenseApi.createExpense(expenseData);
      return res;
    } catch (err) {
      throw err;
    }
  };

  const updateExpense = async (id, expenseData) => {
    try {
      const res = await expenseApi.updateExpense(id, expenseData);
      return res;
    } catch (err) {
      throw err;
    }
  };

  const deleteExpense = async (id) => {
    try {
      const res = await expenseApi.deleteExpense(id);
      return res;
    } catch (err) {
      throw err;
    }
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        totalExpenses,
        totalPages,
        currentPage,
        loading,
        error,
        fetchExpenses,
        fetchAllExpenses,
        addExpense,
        updateExpense,
        deleteExpense,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error("useExpenses must be used within an ExpenseProvider");
  }
  return context;
};
