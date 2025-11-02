"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { registerUser, clearError, signInWithGoogle } from "@/lib/store/slices/authSlice";
import { ButtonLoader } from "@/components/Loader";
import SuccessModal from "@/components/SuccessModal";
import Captcha from "@/components/Captcha";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import { Mail, Lock, User, ArrowRight, CheckCircle } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    // Redirect if already logged in
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    if (!captchaVerified) {
      return;
    }

    if (password !== confirmPassword) {
      dispatch(clearError());
      return;
    }

    if (password.length < 6) {
      dispatch(clearError());
      return;
    }

    const result = await dispatch(registerUser({ name, email, password }));
    
    if (registerUser.fulfilled.match(result)) {
      setShowSuccessModal(true);
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } else if (registerUser.rejected.match(result)) {
      // Error is already set in Redux state and will be displayed
      console.error('Registration failed:', result.payload);
    }
  };

  const handleGoogleSignIn = async () => {
    dispatch(clearError());
    const result = await dispatch(signInWithGoogle());
    
    if (signInWithGoogle.fulfilled.match(result)) {
      setShowSuccessModal(true);
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } else if (signInWithGoogle.rejected.match(result)) {
      // Error is already set in Redux state and will be displayed
      console.error('Google Sign-In failed:', result.payload);
    }
  };

  return (
    <div className="flex-center min-h-[calc(100vh-200px)] py-20">
      <div className="w-full max-w-md">
        <div className="glass p-8 rounded-lg card-shadow">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Create Account</h1>
            <p className="text-light-200">Join AI Events community</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            {password !== confirmPassword && confirmPassword && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm">
                Passwords do not match
              </div>
            )}
            
            {password.length > 0 && password.length < 6 && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm">
                Password must be at least 6 characters
              </div>
            )}

            <Captcha onVerify={setCaptchaVerified} />

            {!captchaVerified && (
              <div className="bg-yellow-500/20 border border-yellow-500/50 text-yellow-200 px-4 py-3 rounded-lg text-sm">
                Please complete the security verification (CAPTCHA) before creating an account.
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-light-100 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-light-200" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-dark-200 border border-dark-200 rounded-lg px-10 py-3 text-white placeholder-light-200 focus:outline-none focus:border-primary transition-colors"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-light-100 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-light-200" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-dark-200 border border-dark-200 rounded-lg px-10 py-3 text-white placeholder-light-200 focus:outline-none focus:border-primary transition-colors"
                  placeholder="your@email.com"
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

            <div>
              <label className="block text-sm font-medium text-light-100 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-light-200" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full bg-dark-200 border border-dark-200 rounded-lg px-10 py-3 text-white placeholder-light-200 focus:outline-none focus:border-primary transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !captchaVerified}
              className="w-full bg-primary hover:bg-primary/90 text-black font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <ButtonLoader />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {isFirebaseConfigured() && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-dark-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-dark-100 text-light-200">Or continue with</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="mt-4 w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300"
              >
                {loading ? (
                  <>
                    <ButtonLoader />
                    Creating account...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Sign up with Google
                  </>
                )}
              </button>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-light-200 text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Account Created Successfully!"
        message={`Welcome to AI Events, ${name}! Your account has been created and you're now logged in. Start exploring amazing AI events!`}
        type="success"
        icon={<CheckCircle className="w-16 h-16 text-primary" />}
      />
    </div>
  );
}

