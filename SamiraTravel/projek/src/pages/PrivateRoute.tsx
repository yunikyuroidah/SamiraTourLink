// src/pages/PrivateRoute.tsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase-config";

type Props = {
  children: JSX.Element;
};

const PrivateRoute: React.FC<Props> = ({ children }) => {
  const [user, loading] = useAuthState(auth);
  const [sessionValid, setSessionValid] = useState<boolean | null>(null);

  useEffect(() => {
    const LAST_LOGIN_KEY = "admin_last_login";
    if (!user) {
      setSessionValid(false);
      return;
    }

    try {
      const raw = localStorage.getItem(LAST_LOGIN_KEY);
      if (!raw) {
        setSessionValid(false);
        return;
      }

      const parsed = JSON.parse(raw) as { email?: string; expiresAt?: number };
      const now = Date.now();
      if (!parsed?.email || !parsed?.expiresAt || parsed.email !== user.email) {
        setSessionValid(false);
        return;
      }

      if (now > parsed.expiresAt) {
        setSessionValid(false);
        return;
      }

      setSessionValid(true);
    } catch {
      setSessionValid(false);
    }
  }, [user]);

  // Saat status auth masih dicek
  if (loading || sessionValid === null) {
    return <p>Loading...</p>;
  }

  if (!sessionValid && user) {
    auth.signOut().catch(() => {
      /* ignore */
    });
    return <Navigate to="/admin/login" replace />;
  }

  // Kalau belum login, arahkan ke halaman login admin
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // Kalau sudah login, tampilkan konten anak (mis. HomeAdmin)
  return children;
};

export default PrivateRoute;
