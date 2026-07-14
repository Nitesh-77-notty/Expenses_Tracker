import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { UIProvider } from "./context/UIContext.jsx";
import { CategoryProvider } from "./context/CategoryContext.jsx";
import { ExpenseProvider } from "./context/ExpenseContext.jsx";
import { BudgetProvider } from "./context/BudgetContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <UIProvider>
          <CategoryProvider>
            <ExpenseProvider>
              <BudgetProvider>
                <App />
              </BudgetProvider>
            </ExpenseProvider>
          </CategoryProvider>
        </UIProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
