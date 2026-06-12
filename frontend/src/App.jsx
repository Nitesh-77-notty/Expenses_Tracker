import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./Layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Categories from "./pages/Categories";
import Budgets from "./pages/Budgets";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      <Route
        path="/"
        element={
          <MainLayout>
            <Dashboard />
          </MainLayout>
        }
      />
      <Route
        path="/expenses"
        element={
          <MainLayout>
            <Expenses />
          </MainLayout>
        }
      />
      <Route
        path="/categories"
        element={
          <MainLayout>
            <Categories />
          </MainLayout>
        }
      />
      <Route
        path="/budgets"
        element={
          <MainLayout>
            <Budgets />
          </MainLayout>
        }
      />
      <Route
        path="/analytics"
        element={
          <MainLayout>
            <Analytics />
          </MainLayout>
        }
      />
    </Routes>
  );
};

export default App;
