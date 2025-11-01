"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { logout } from "@/lib/store/slices/authSlice";
import { User, LogOut, Calendar } from "lucide-react";

export default function Navbar() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  const isAdminUser = user?.role === "admin";

  const isActive = (path: string) => pathname === path;

  return (
    <header>
      <nav>
        <Link href="/" className="logo">
          <Calendar className="w-8 h-8 text-primary" />
          <p>AI Events</p>
        </Link>

        <ul>
          <li>
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/") ? "text-primary" : "text-light-100"
              }`}
            >
              Events
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/about") ? "text-primary" : "text-light-100"
              }`}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/contact") ? "text-primary" : "text-light-100"
              }`}
            >
              Contact
            </Link>
          </li>
          
          {isAuthenticated && user ? (
            <>
              {isAdminUser && (
                <li>
                  <Link
                    href="/admin"
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      isActive("/admin") ? "text-primary" : "text-light-100"
                    }`}
                  >
                    Dashboard
                  </Link>
                </li>
              )}
              <li>
                <Link
                  href="/profile"
                  className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                    isActive("/profile") ? "text-primary" : "text-light-200"
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>{user.name}</span>
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-medium text-light-100 hover:text-primary transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  href="/login"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive("/login") ? "text-primary" : "text-light-100"
                  }`}
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="bg-primary hover:bg-primary/90 text-black text-sm font-semibold px-6 py-2 rounded-full transition-colors"
                >
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

