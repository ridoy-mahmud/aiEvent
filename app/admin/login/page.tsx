"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { loginUser, clearError, logout } from "@/lib/store/slices/authSlice";
import { ButtonLoader } from "@/components/Loader";
import Captcha from "@/components/Captcha";
import { Mail, Lock, ArrowLeft, Shield } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const dispatch = useAppDispatch();
  const { user, loading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );
  const router = useRouter();

  useEffect(() => {
    // Redirect if already logged in as admin
    if (isAuthenticated && user) {
      if (user.role === "admin") {
        router.push("/admin");
      } else {
        // If logged in but not admin, logout
        dispatch(logout());
      }
    }
  }, [isAuthenticated, user, router, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    // Verify CAPTCHA before proceeding
    if (!captchaVerified) {
      return;
    }

    const result = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(result)) {
      // Verify user is admin
      if (result.payload.user.role === "admin") {
        router.push("/admin");
      } else {
        dispatch(logout());
        dispatch(clearError());
      }
    }
  };

  return (
    <div className="flex-center min-h-[calc(100vh-200px)] py-20">
      <div className="w-full max-w-md">
        <div className="glass p-8 rounded-lg card-shadow">
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/login"
              className="text-light-200 hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex-1 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Shield className="w-6 h-6 text-primary" />
                <h1 className="text-3xl font-bold">Admin Login</h1>
              </div>
              <p className="text-light-200 text-sm">
                Sign in to access admin dashboard
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 mt-8">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {!captchaVerified && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm">
                Please complete the security verification (CAPTCHA) before
                logging in.
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-light-100 mb-2">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-light-200" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-dark-200 border border-dark-200 rounded-lg px-10 py-3 text-white placeholder-light-200 focus:outline-none focus:border-primary transition-colors"
                  placeholder="admin@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-light-100 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-light-200" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-dark-200 border border-dark-200 rounded-lg px-10 py-3 text-white placeholder-light-200 focus:outline-none focus:border-primary transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Captcha onVerify={setCaptchaVerified} />

            <button
              type="submit"
              disabled={loading || !captchaVerified}
              className="w-full bg-primary hover:bg-primary/90 text-black font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <ButtonLoader />
                  Signing in...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Sign in as Admin
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-light-200 hover:text-primary transition-colors text-sm"
            >
              ← Back to User Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
