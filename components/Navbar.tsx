"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { logout } from "@/lib/store/slices/authSlice";
import { User, LogOut, Menu, X } from "lucide-react";
import AISummitLogo from "./AISummitLogo";
import { useState, useEffect } from "react";

export default function Navbar() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only showing user-dependent content after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
    setMobileMenuOpen(false);
  };

  const isAdminUser = user?.role === "admin";

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-dark-100/80 border-b border-dark-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
        <div className="flex items-center justify-between w-full">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0">
            <AISummitLogo className="w-8 h-8 sm:w-10 sm:h-10 group-hover:scale-110 transition-transform" />
            <p className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent whitespace-nowrap">
              AI Summit
            </p>
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center gap-4 lg:gap-6 list-none">
          <li className="list-none">
            <Link
              href="/"
              className={`text-sm lg:text-base font-medium transition-colors hover:text-primary py-1 px-2 ${
                isActive("/") ? "text-primary" : "text-light-100"
              }`}
            >
              Events
            </Link>
          </li>
          <li className="list-none">
            <Link
              href="/about"
              className={`text-sm lg:text-base font-medium transition-colors hover:text-primary py-1 px-2 ${
                isActive("/about") ? "text-primary" : "text-light-100"
              }`}
            >
              About
            </Link>
          </li>
          <li className="list-none">
            <Link
              href="/contact"
              className={`text-sm lg:text-base font-medium transition-colors hover:text-primary py-1 px-2 ${
                isActive("/contact") ? "text-primary" : "text-light-100"
              }`}
            >
              Contact
            </Link>
          </li>
          
          {mounted && !loading && isAuthenticated && user ? (
            <>
              {isAdminUser && (
                <li className="list-none">
                  <Link
                    href="/admin"
                    className={`text-sm lg:text-base font-medium transition-colors hover:text-primary py-1 px-2 ${
                      isActive("/admin") ? "text-primary" : "text-light-100"
                    }`}
                  >
                    Dashboard
                  </Link>
                </li>
              )}
              <li className="list-none">
                <Link
                  href="/profile"
                  className={`flex items-center gap-2 text-sm lg:text-base font-medium transition-colors hover:text-primary py-1 px-2 ${
                    isActive("/profile") ? "text-primary" : "text-light-200"
                  }`}
                >
                  <User className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden xl:inline max-w-[150px] truncate" title={user.name}>
                    {user.name}
                  </span>
                  <span className="xl:hidden max-w-[80px] truncate" title={user.name}>
                    {user.name.split(' ')[0]}
                  </span>
                </Link>
              </li>
              <li className="list-none">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm lg:text-base font-medium text-light-100 hover:text-primary transition-colors py-1 px-2"
                >
                  <LogOut className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden lg:inline">Logout</span>
                </button>
              </li>
            </>
          ) : mounted && !loading ? (
            <>
              <li className="list-none">
                <Link
                  href="/login"
                  className={`text-sm lg:text-base font-medium transition-colors hover:text-primary py-1 px-2 ${
                    isActive("/login") ? "text-primary" : "text-light-100"
                  }`}
                >
                  Login
                </Link>
              </li>
              <li className="list-none">
                <Link
                  href="/register"
                  className="bg-primary hover:bg-primary/90 text-black text-sm lg:text-base font-semibold px-4 lg:px-6 py-2 rounded-full transition-colors whitespace-nowrap"
                >
                  Sign Up
                </Link>
              </li>
            </>
          ) : (
            // Show login during SSR/hydration to prevent mismatch
            <>
              <li className="list-none">
                <Link
                  href="/login"
                  className={`text-sm lg:text-base font-medium transition-colors hover:text-primary py-1 px-2 ${
                    isActive("/login") ? "text-primary" : "text-light-100"
                  }`}
                >
                  Login
                </Link>
              </li>
              <li className="list-none">
                <Link
                  href="/register"
                  className="bg-primary hover:bg-primary/90 text-black text-sm lg:text-base font-semibold px-4 lg:px-6 py-2 rounded-full transition-colors whitespace-nowrap"
                >
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-light-100 hover:text-primary transition-colors p-2"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-dark-200 pt-4">
            <div className="flex flex-col space-y-2">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`block text-sm font-medium transition-colors hover:text-primary py-2 px-2 rounded-lg ${
                  isActive("/") ? "text-primary bg-primary/10" : "text-light-100"
                }`}
              >
                Events
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className={`block text-sm font-medium transition-colors hover:text-primary py-2 px-2 rounded-lg ${
                  isActive("/about") ? "text-primary bg-primary/10" : "text-light-100"
                }`}
              >
                About
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className={`block text-sm font-medium transition-colors hover:text-primary py-2 px-2 rounded-lg ${
                  isActive("/contact") ? "text-primary bg-primary/10" : "text-light-100"
                }`}
              >
                Contact
              </Link>
              
              {mounted && !loading && isAuthenticated && user ? (
                <>
                  {isAdminUser && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block text-sm font-medium transition-colors hover:text-primary py-2 px-2 rounded-lg ${
                        isActive("/admin") ? "text-primary bg-primary/10" : "text-light-100"
                      }`}
                    >
                      Dashboard
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary py-2 px-2 rounded-lg ${
                      isActive("/profile") ? "text-primary bg-primary/10" : "text-light-200"
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>{user.name}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm font-medium text-light-100 hover:text-primary transition-colors py-2 px-2 rounded-lg text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block text-sm font-medium transition-colors hover:text-primary py-2 px-2 rounded-lg ${
                      isActive("/login") ? "text-primary bg-primary/10" : "text-light-100"
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block bg-primary hover:bg-primary/90 text-black text-sm font-semibold px-6 py-2 rounded-full transition-colors text-center"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

