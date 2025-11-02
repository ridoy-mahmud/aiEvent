"use client";

import Link from "next/link";
import { 
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
  Network,
  Globe,
  Shield,
  FileText
} from "lucide-react";
import AISummitLogo from "./AISummitLogo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-dark-200 mt-20 bg-dark-100/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-10">
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              <AISummitLogo className="w-10 h-10 group-hover:scale-110 transition-transform" />
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                AI Summit
              </span>
            </Link>
            <p className="text-light-200 text-sm mb-6 leading-relaxed max-w-xs">
              Your premier destination for discovering cutting-edge AI conferences, 
              workshops, and networking events worldwide.
            </p>
            <div className="flex gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-dark-200 hover:bg-primary hover:text-black rounded-lg flex-center transition-all duration-300 hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-dark-200 hover:bg-primary hover:text-black rounded-lg flex-center transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-dark-200 hover:bg-primary hover:text-black rounded-lg flex-center transition-all duration-300 hover:scale-110"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-dark-200 hover:bg-primary hover:text-black rounded-lg flex-center transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-dark-200 hover:bg-primary hover:text-black rounded-lg flex-center transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-5 text-light-100">Quick Links</h3>
            <div className="space-y-3">
              <Link href="/" className="flex items-center gap-2 text-light-200 hover:text-primary transition-colors text-sm group">
                <Home className="w-4 h-4 text-primary group-hover:scale-110 transition-transform flex-shrink-0" />
                <span>All Events</span>
              </Link>
              <Link href="/about" className="flex items-center gap-2 text-light-200 hover:text-primary transition-colors text-sm group">
                <Info className="w-4 h-4 text-primary group-hover:scale-110 transition-transform flex-shrink-0" />
                <span>About Us</span>
              </Link>
              <Link href="/contact" className="flex items-center gap-2 text-light-200 hover:text-primary transition-colors text-sm group">
                <MessageSquare className="w-4 h-4 text-primary group-hover:scale-110 transition-transform flex-shrink-0" />
                <span>Contact</span>
              </Link>
              <Link href="/register" className="flex items-center gap-2 text-light-200 hover:text-primary transition-colors text-sm group">
                <UserPlus className="w-4 h-4 text-primary group-hover:scale-110 transition-transform flex-shrink-0" />
                <span>Create Account</span>
              </Link>
              <Link href="/login" className="flex items-center gap-2 text-light-200 hover:text-primary transition-colors text-sm group">
                <LogIn className="w-4 h-4 text-primary group-hover:scale-110 transition-transform flex-shrink-0" />
                <span>Login</span>
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-5 text-light-100">Event Categories</h3>
            <div className="space-y-3">
              <Link href="/?category=Technology" className="flex items-center gap-2 text-light-200 hover:text-primary transition-colors text-sm group">
                <Zap className="w-4 h-4 text-primary group-hover:scale-110 transition-transform flex-shrink-0" />
                <span>Technology</span>
              </Link>
              <Link href="/?category=Workshop" className="flex items-center gap-2 text-light-200 hover:text-primary transition-colors text-sm group">
                <GraduationCap className="w-4 h-4 text-primary group-hover:scale-110 transition-transform flex-shrink-0" />
                <span>Workshops</span>
              </Link>
              <Link href="/?category=Conference" className="flex items-center gap-2 text-light-200 hover:text-primary transition-colors text-sm group">
                <Presentation className="w-4 h-4 text-primary group-hover:scale-110 transition-transform flex-shrink-0" />
                <span>Conferences</span>
              </Link>
              <Link href="/?category=Seminar" className="flex items-center gap-2 text-light-200 hover:text-primary transition-colors text-sm group">
                <Users className="w-4 h-4 text-primary group-hover:scale-110 transition-transform flex-shrink-0" />
                <span>Seminars</span>
              </Link>
              <Link href="/?category=Networking" className="flex items-center gap-2 text-light-200 hover:text-primary transition-colors text-sm group">
                <Network className="w-4 h-4 text-primary group-hover:scale-110 transition-transform flex-shrink-0" />
                <span>Networking</span>
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-5 text-light-100">Get in Touch</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-light-200 text-xs mb-1">Email</p>
                  <a href="mailto:contact@aisummit.com" className="text-primary hover:underline text-sm break-all">
                    contact@aisummit.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-light-200 text-xs mb-1">Support</p>
                  <a href="mailto:support@aisummit.com" className="text-primary hover:underline text-sm break-all">
                    support@aisummit.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-light-200 text-xs mb-1">Website</p>
                  <a href="/" className="text-primary hover:underline text-sm">
                    www.aisummit.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-dark-200 pt-6 md:pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-light-200 text-sm text-center md:text-left">
              © {currentYear} <span className="text-primary font-semibold">AI Summit</span>. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm">
              <Link href="/" className="flex items-center gap-1.5 text-light-200 hover:text-primary transition-colors group">
                <Shield className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Privacy Policy</span>
              </Link>
              <Link href="/" className="flex items-center gap-1.5 text-light-200 hover:text-primary transition-colors group">
                <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Terms of Service</span>
              </Link>
              <Link href="/" className="flex items-center gap-1.5 text-light-200 hover:text-primary transition-colors group">
                <Shield className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Cookie Policy</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

