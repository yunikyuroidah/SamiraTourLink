// src/App.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// halaman beranda customer
import Hero from "./components/Hero";
import About from "./components/About";
import Keunggulan from "./components/Keunggulan";
import Packages from "./components/Packages";
import Gallery from "./components/Gallery";
import Leader from "./components/Leader";
import Footer from "./components/Footer";
import ScrollControls from "./components/ScrollControls";

// router untuk halaman admin
import HomeAdmin from "./HomeAdmin";
// NOTE: file login-mu bernama "admin-login.tsx" — import sesuai nama itu:
import AdminLogin from "./pages/admin-login";
import PrivateRoute from "./pages/PrivateRoute";

function App() {
  return (
    <Routes>
      {/* Halaman utama (customer) */}
      <Route
        path="/"
        element={
          <>
            <Hero />
            <About />
            <Keunggulan />
            <Packages />
            <Gallery />
            <Leader />
            <Footer />
            <ScrollControls />
          </>
        }
      />

      {/* Halaman login admin (path: /admin/login) */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Semua route /admin/* diarahkan ke router admin dan diproteksi */}
      <Route
        path="/admin/*"
        element={
          <PrivateRoute>
            <HomeAdmin />
          </PrivateRoute>
        }
      />

      {/* Fallback: kalau URL tidak dikenal, kembali ke beranda */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
