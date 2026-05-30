import React from "react";
import Sidebar from "../components/Sidebar";
const MainLayout = ({ children }) => {
  return (
    <div className="flex h-screen l">
      <aside>
        <Sidebar />
      </aside>
      <main className="flex-1 p-4 ml-64">{children}</main>
    </div>
  );
};

export default MainLayout;
