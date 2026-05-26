import React from "react";
import MainLayout from "./Layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import { Routes, Route } from "react-router-dom";
const App = () => {
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
