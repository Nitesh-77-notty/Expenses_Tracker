import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const MainLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-[#f9fafb]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header sidebarWidth={256} />
        <main className="flex-1 p-6 mt-16 ml-64 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
