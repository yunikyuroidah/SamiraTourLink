import React from "react";
import AdminSidebar from "../pages/AdminSidebar";

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 animate-fade-in">
          <div className="max-w-7xl mx-auto">
            {/* Main Content Container */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden animate-slide-up">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
