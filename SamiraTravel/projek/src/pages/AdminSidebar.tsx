// src/components/AdminSidebar.tsx
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const linkClass = (path: string) =>
    `group flex items-center px-4 py-3 rounded-lg transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-primary-500/20 hover:to-skyblue-500/20 hover:shadow-lg transform hover:scale-105 ${
      location.pathname === path 
        ? "bg-gradient-to-r from-primary-500/30 to-skyblue-500/30 shadow-md border-l-4 border-primary-500" 
        : "hover:translate-x-1"
    }`;

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    navigate("/admin/login");
  };

  const menuItems = [
    {
      path: "/admin/packages",
      label: "Paket Travel",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H6a1 1 0 00-1 1v1M4 13v-1a1 1 0 011-1h2a1 1 0 011 1v1" />
        </svg>
      )
    },
    {
      path: "/admin/profile-travel",
      label: "Profil Travel",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      path: "/admin/tour-leader",
      label: "Tour Leader",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      path: "/admin/dokumentasi",
      label: "Dokumentasi",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M16 5a1 1 0 112 0 1 1 0 01-2 0z" />
        </svg>
      )
    }
  ];

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-64'} bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white min-h-screen transition-all duration-300 ease-in-out shadow-2xl animate-slide-right`}>
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold gradient-text">Samira Travel</h2>
              <p className="text-slate-400 text-sm">Admin Dashboard</p>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors duration-200"
          >
            <svg 
              className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 p-4">
        {menuItems.map((item, index) => (
          <Link 
            key={item.path}
            to={item.path} 
            className={linkClass(item.path)}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center">
              <div className="text-primary-400 group-hover:text-primary-300 transition-colors duration-200">
                {item.icon}
              </div>
              {!isCollapsed && (
                <span className="ml-3 font-medium group-hover:text-white transition-colors duration-200">
                  {item.label}
                </span>
              )}
            </div>
            {location.pathname === item.path && (
              <div className="w-2 h-2 rounded-full bg-primary-400 animate-pulse ml-auto"></div>
            )}
          </Link>
        ))}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-3 mt-8 rounded-lg bg-gradient-to-r from-primary-500 to-skyblue-500 hover:from-primary-600 hover:to-skyblue-600 text-white font-semibold transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-primary-500/25 transform hover:scale-105 group"
        >
          <svg className="w-5 h-5 text-white group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {!isCollapsed && (
            <span className="ml-3">Logout</span>
          )}
        </button>
      </nav>


    </div>
  );
};

export default AdminSidebar;
