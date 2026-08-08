import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-[var(--color-background)] font-sans">
      {/* Sticky Left Sidebar */}
      <AdminSidebar />

      {/* Main Content View Container */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminNavbar />
        
        <main className="p-6 sm:p-8 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}