// src/HomeAdmin.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AdminLogin from "./pages/admin-login";
import AdminPackages from "./pages/admin-packages";
import AdminProfileTravel from "./pages/admin-profile-travel";
import AdminTourLeader from "./pages/admin-tour-leader";
import AdminDokumentasi from "./pages/admin-dokumentasi";
import PrivateRoute from "./pages/PrivateRoute";
import AdminLayout from "./pages/AdminLayout";

const HomeAdmin: React.FC = () => {
  return (
    <Routes>
      {/* Shortcut /admin -> dashboard utama */}
      <Route path="/" element={<Navigate to="packages" replace />} />

      {/* Login admin */}
      <Route path="login" element={<AdminLogin />} />

      {/* Halaman admin (dilindungi) */}
      <Route
        path="packages"
        element={
          <PrivateRoute>
            <AdminLayout>
              <AdminPackages />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="profile-travel"
        element={
          <PrivateRoute>
            <AdminLayout>
              <AdminProfileTravel />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="tour-leader"
        element={
          <PrivateRoute>
            <AdminLayout>
              <AdminTourLeader />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="dokumentasi"
        element={
          <PrivateRoute>
            <AdminLayout>
              <AdminDokumentasi />
            </AdminLayout>
          </PrivateRoute>
        }
      />

      {/* fallback admin */}
      <Route path="*" element={<Navigate to="packages" replace />} />
    </Routes>
  );
};

export default HomeAdmin;
