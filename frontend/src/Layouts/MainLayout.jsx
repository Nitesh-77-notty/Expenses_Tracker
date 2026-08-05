import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#f9fafb]">
      {/* Sidebar backdrop for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header sidebarWidth={256} onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 mt-16 ml-0 lg:ml-64 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
