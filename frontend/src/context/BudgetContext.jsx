import React, { createContext, useContext, useState, useEffect } from "react";
import * as budgetApi from "../services/budgetApi";
import { useAuth } from "./AuthContext";

const BudgetContext = createContext(null);

export const BudgetProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [activeBudget, setActiveBudget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBudgets = async (year) => {
    setLoading(true);
    try {
      const res = await budgetApi.getBudgets(year);
      if (res.success) {
        setBudgets(res.data);
        setError(null);
      }
    } catch (err) {
      setError(err.message || "Failed to load budgets");
    } finally {
      setLoading(false);
    }
  };

  const fetchBudgetByMonth = async (month, year) => {
    setLoading(true);
    try {
      const res = await budgetApi.getBudgetByMonth(month, year);
      if (res.success) {
        setActiveBudget(res.data);
        setError(null);
        return res.data;
      }
    } catch (err) {
      // If 404 is returned, it means no budget is set yet for this month
      if (err.message.includes("No budget found")) {
        setActiveBudget(null);
        setError(null);
      } else {
        setError(err.message || "Failed to load budget for the month");
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBudgets();
      const now = new Date();
      fetchBudgetByMonth(now.getMonth() + 1, now.getFullYear());
    } else {
      setBudgets([]);
      setActiveBudget(null);
    }
  }, [isAuthenticated]);

  const addBudget = async (budgetData) => {
    try {
      const res = await budgetApi.createBudget(budgetData);
      if (res.success) {
        setBudgets((prev) => [res.data, ...prev]);
        const now = new Date();
        if (res.data.month === now.getMonth() + 1 && res.data.year === now.getFullYear()) {
          setActiveBudget(res.data);
        }
        return res;
      }
    } catch (err) {
      throw err;
    }
  };

  const editBudget = async (id, budgetData) => {
    try {
      const res = await budgetApi.updateBudget(id, budgetData);
      if (res.success) {
        setBudgets((prev) =>
          prev.map((b) => (b._id === id ? res.data : b))
        );
        if (activeBudget && activeBudget._id === id) {
          setActiveBudget(res.data);
        }
        return res;
      }
    } catch (err) {
      throw err;
    }
  };

  const deleteBudget = async (id) => {
    try {
      const res = await budgetApi.deleteBudget(id);
      if (res.success) {
        setBudgets((prev) => prev.filter((b) => b._id !== id));
        if (activeBudget && activeBudget._id === id) {
          setActiveBudget(null);
        }
        return res;
      }
    } catch (err) {
      throw err;
    }
  };

  return (
    <BudgetContext.Provider
      value={{
        budgets,
        activeBudget,
        loading,
        error,
        fetchBudgets,
        fetchBudgetByMonth,
        addBudget,
        editBudget,
        deleteBudget,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudgets = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error("useBudgets must be used within a BudgetProvider");
  }
  return context;
};
