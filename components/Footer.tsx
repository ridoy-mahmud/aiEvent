"use client";

import Link from "next/link";
import { 
  Calendar, 
  Mail, 
  Twitter, 
  Linkedin, 
  Github, 
  Facebook, 
  Instagram,
  Home,
  Info,
  MessageSquare,
  UserPlus,
  LogIn,
  Zap,
  Users,
  Presentation,
  GraduationCap,
  Network
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-dark-200 mt-20">
      <div className="container mx-auto px-5 sm:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Calendar className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold">AI Events</span>
            </Link>
            <p className="text-light-200 text-sm mb-4 leading-relaxed">
              Your premier destination for discovering cutting-edge AI conferences, 
              workshops, and networking events worldwide.
            </p>
            <div className="flex gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-dark-100 hover:bg-primary hover:text-black rounded-lg flex-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-dark-100 hover:bg-primary hover:text-black rounded-lg flex-center transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-dark-100 hover:bg-primary hover:text-black rounded-lg flex-center transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-dark-100 hover:bg-primary hover:text-black rounded-lg flex-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-dark-100 hover:bg-primary hover:text-black rounded-lg flex-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/" className="flex items-center gap-2 text-light-200 hover:text-primary transition-colors text-sm group">
                <Home className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                <span>All Events</span>
              </Link>
              <Link href="/about" className="flex items-center gap-2 text-light-200 hover:text-primary transition-colors text-sm group">
                <Info className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                <span>About Us</span>
              </Link>
              <Link href="/contact" className="flex items-center gap-2 text-light-200 hover:text-primary transition-colors text-sm group">
                <MessageSquare className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                <span>Contact</span>
              </Link>
              <Link href="/register" className="flex items-center gap-2 text-light-200 hover:text-primary transition-colors text-sm group">
                <UserPlus className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                <span>Create Account</span>
              </Link>
              <Link href="/login" className="flex items-center gap-2 text-light-200 hover:text-primary transition-colors text-sm group">
                <LogIn className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                <span>Login</span>
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Event Categories</h3>
            <div className="space-y-2">
              <Link href="/?category=Technology" className="flex items-center gap-2 text-light-200 hover:text-primary transition-colors text-sm group">
                <Zap className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                <span>Technology</span>
              </Link>
              <Link href="/?category=Workshop" className="flex items-center gap-2 text-light-200 hover:text-primary transition-colors text-sm group">
                <GraduationCap className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                <span>Workshops</span>
              </Link>
              <Link href="/?category=Conference" className="flex items-center gap-2 text-light-200 hover:text-primary transition-colors text-sm group">
                <Presentation className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                <span>Conferences</span>
              </Link>
              <Link href="/?category=Seminar" className="flex items-center gap-2 text-light-200 hover:text-primary transition-colors text-sm group">
                <Users className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                <span>Seminars</span>
              </Link>
              <Link href="/?category=Networking" className="flex items-center gap-2 text-light-200 hover:text-primary transition-colors text-sm group">
                <Network className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                <span>Networking</span>
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Get in Touch</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-light-200 text-sm">Email</p>
                  <a href="mailto:contact@aievents.com" className="text-primary hover:underline text-sm">
                    contact@aievents.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-light-200 text-sm">Support</p>
                  <a href="mailto:support@aievents.com" className="text-primary hover:underline text-sm">
                    support@aievents.com
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-dark-200 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-light-200 text-sm">
              © {currentYear} AI Events. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/" className="text-light-200 hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/" className="text-light-200 hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="/" className="text-light-200 hover:text-primary transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

