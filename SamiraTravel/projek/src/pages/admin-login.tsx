import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithPopup,
  GoogleAuthProvider,
  AuthError,
  signOut
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { auth, db } from "../firebase-config";

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockExpiresAt, setBlockExpiresAt] = useState<number | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number>(3);

  const STORAGE_KEY = "admin_login_security";
  const LAST_LOGIN_KEY = "admin_last_login";
  const ATTEMPT_LIMIT = 3;
  const BLOCK_DURATION_MS = 7 * 24 * 60 * 60 * 1000;
  const SESSION_DURATION_MS = 60 * 60 * 1000; // 1 jam

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setRemainingAttempts(ATTEMPT_LIMIT);
        return;
      }
      const parsed = JSON.parse(raw) as { attempts?: number; blockUntil?: number | null };
      const now = Date.now();
      const attempts = parsed.attempts ?? 0;
      if (parsed.blockUntil && now < parsed.blockUntil) {
        setIsBlocked(true);
        setBlockExpiresAt(parsed.blockUntil);
        setRemainingAttempts(0);
        setError(`Perangkat ini diblokir hingga ${new Date(parsed.blockUntil).toLocaleString("id-ID")}.`);
        return;
      }

      if (parsed.blockUntil && now >= parsed.blockUntil) {
        localStorage.removeItem(STORAGE_KEY);
        setRemainingAttempts(ATTEMPT_LIMIT);
        setIsBlocked(false);
        setBlockExpiresAt(null);
        return;
      }

      setRemainingAttempts(Math.max(ATTEMPT_LIMIT - attempts, 0));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      setRemainingAttempts(ATTEMPT_LIMIT);
      setIsBlocked(false);
      setBlockExpiresAt(null);
    }
  }, []);

  const resetSecurityState = () => {
    localStorage.removeItem(STORAGE_KEY);
    setIsBlocked(false);
    setBlockExpiresAt(null);
    setRemainingAttempts(ATTEMPT_LIMIT);
  };

  const recordFailedAttempt = () => {
    const now = Date.now();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as { attempts?: number; blockUntil?: number | null }) : {};
      const activeBlock = parsed.blockUntil && now < parsed.blockUntil;
      if (activeBlock) {
        setIsBlocked(true);
        setBlockExpiresAt(parsed.blockUntil ?? null);
        setRemainingAttempts(0);
        return { blocked: true as const, attemptsLeft: 0, blockUntil: parsed.blockUntil ?? null };
      }

      const currentAttempts = (parsed.attempts ?? 0) + 1;
      if (currentAttempts >= ATTEMPT_LIMIT) {
        const blockUntil = now + BLOCK_DURATION_MS;
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ attempts: currentAttempts, blockUntil })
        );
        setIsBlocked(true);
        setBlockExpiresAt(blockUntil);
        setRemainingAttempts(0);
        return { blocked: true as const, attemptsLeft: 0, blockUntil };
      }

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ attempts: currentAttempts, blockUntil: null })
      );
      const attemptsLeft = ATTEMPT_LIMIT - currentAttempts;
      setRemainingAttempts(attemptsLeft);
      return { blocked: false as const, attemptsLeft, blockUntil: null };
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      setRemainingAttempts(ATTEMPT_LIMIT);
      return { blocked: false as const, attemptsLeft: ATTEMPT_LIMIT, blockUntil: null };
    }
  };

  const handleGoogleLogin = async () => {
    if (isBlocked) {
      const untilText = blockExpiresAt
        ? new Date(blockExpiresAt).toLocaleString("id-ID")
        : "waktu yang ditentukan";
      setError(`Perangkat ini diblokir hingga ${untilText}.`);
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (!user?.email) {
        await signOut(auth);
        throw new FirebaseError("auth/missing-email", "Akun Google tidak memiliki email yang valid.");
      }

      try {
        await setDoc(
          doc(db, "adminSessions", user.uid),
          {
            email: user.email,
            lastLoginAt: serverTimestamp()
          },
          { merge: true }
        );
      } catch (fireErr) {
        const firebaseError = fireErr as FirebaseError;
        if (firebaseError.code === "permission-denied") {
          await signOut(auth);
          throw new FirebaseError("auth/unauthorized-email", "Email Anda tidak terdaftar sebagai admin.");
        }
        throw fireErr;
      }

      resetSecurityState();
      const payload = {
        email: user.email,
        expiresAt: Date.now() + SESSION_DURATION_MS
      };
      localStorage.setItem(LAST_LOGIN_KEY, JSON.stringify(payload));
      navigate("/admin", { replace: true });
    } catch (err) {
      const aErr = err as AuthError;
      localStorage.removeItem(LAST_LOGIN_KEY);
      const result = recordFailedAttempt();
      if (result.blocked) {
        const untilText = result.blockUntil
          ? new Date(result.blockUntil).toLocaleString("id-ID")
          : "7 hari ke depan";
        setError(`Perangkat ini diblokir hingga ${untilText}.`);
      } else {
        const fallbackMessage = result.attemptsLeft
          ? `Login gagal. Sisa kesempatan: ${result.attemptsLeft}.`
          : "Login Google gagal.";
        setError(aErr.message || fallbackMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-primary-900 to-skyblue-900 p-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-skyblue-500/20 rounded-full blur-3xl animate-bounce-gentle"></div>
        <div className="absolute top-3/4 left-1/3 w-48 h-48 bg-primary-400/10 rounded-full blur-2xl animate-pulse"></div>
      </div>

      {/* Login Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Back to Home Button */}
        <div className="mb-6 animate-slide-down">
          <button
            onClick={() => navigate("/")}
            className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-200 group"
          >
            <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm font-medium">Kembali ke Halaman Utama</span>
          </button>
        </div>

        {/* Logo/Brand Section */}
        <div className="text-center mb-8 animate-slide-down">
          <div className="inline-block p-4 rounded-full bg-gradient-to-r from-primary-500 to-skyblue-500 shadow-2xl mb-4">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white gradient-text mb-2">Samira Travel</h1>
          <p className="text-slate-300">Admin Dashboard</p>
        </div>

        {/* Login Card */}
        <div className="glass rounded-2xl shadow-2xl p-8 animate-slide-up">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Selamat Datang Kembali</h2>
            <p className="text-slate-600">Masuk ke panel admin untuk mengelola travel</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-slide-down">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            </div>
          )}

          <button
            onClick={handleGoogleLogin}
            disabled={loading || isBlocked}
            className="w-full group relative overflow-hidden bg-white border-2 border-slate-200 hover:border-primary-300 rounded-xl px-6 py-4 flex items-center justify-center space-x-3 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/25 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {/* Button Background Animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-skyblue-500/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            
            <div className="relative flex items-center space-x-3">
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-500 border-t-transparent"></div>
              ) : (
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
              )}
              <span className="font-semibold text-slate-700 group-hover:text-slate-800 transition-colors duration-200">
                {loading ? "Sedang masuk..." : isBlocked ? "Login diblokir" : "Masuk dengan Google"}
              </span>
            </div>
          </button>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Hanya admin yang diotorisasi yang dapat mengakses dashboard ini
            </p>
            {!isBlocked && remainingAttempts < ATTEMPT_LIMIT && (
              <p className="text-xs text-red-500 mt-2">Sisa kesempatan login: {remainingAttempts}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 animate-fade-in">
          <p className="text-slate-400 text-sm">© 2024 Samira Travel. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
