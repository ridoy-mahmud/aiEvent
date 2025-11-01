"use client";

import { useEffect, useState, useCallback } from "react";
import { CheckCircle, X, Calendar, User } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: "success" | "error" | "info";
  icon?: React.ReactNode;
}

export default function SuccessModal({
  isOpen,
  onClose,
  title,
  message,
  type = "success",
  icon,
}: SuccessModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClose = useCallback(() => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      // Auto close after 3 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const defaultIcon =
    icon ||
    (type === "success" ? (
      <CheckCircle className="w-16 h-16 text-primary" />
    ) : type === "error" ? (
      <X className="w-16 h-16 text-red-500" />
    ) : (
      <Calendar className="w-16 h-16 text-primary" />
    ));

  return (
    <div
      className={`fixed inset-0 z-50 flex-center transition-opacity duration-300 ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className={`relative glass p-8 rounded-2xl card-shadow max-w-md w-full mx-4 transform transition-all duration-300 ${
          isAnimating
            ? "scale-100 translate-y-0"
            : "scale-95 translate-y-4"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-light-200 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="text-center space-y-4">
          {/* Success Checkmark Animation */}
          {type === "success" && (
            <div className="flex-center">
              <div className="relative">
                <div className="absolute inset-0 flex-center">
                  <div className="w-20 h-20 rounded-full bg-primary/20 animate-ping" />
                </div>
                <div className="relative">
                  <div
                    className={`w-16 h-16 rounded-full bg-primary/30 flex-center transform transition-all duration-500 ${
                      isAnimating ? "scale-100 rotate-0" : "scale-0 rotate-180"
                    }`}
                  >
                    {defaultIcon}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Icon Animation for non-success types */}
          {type !== "success" && (
            <div className="flex-center">
              <div
                className={`transform transition-all duration-500 ${
                  isAnimating ? "scale-100 rotate-0" : "scale-0 rotate-180"
                }`}
              >
                {defaultIcon}
              </div>
            </div>
          )}

          {/* Title */}
          <h2
            className={`text-2xl font-bold ${
              type === "success"
                ? "text-primary"
                : type === "error"
                ? "text-red-500"
                : "text-light-100"
            }`}
          >
            {title}
          </h2>

          {/* Message */}
          <p className="text-light-200 text-lg leading-relaxed">{message}</p>

          {/* Confetti Effect (success only) */}
          {type === "success" && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-primary rounded-full animate-ping"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 0.5}s`,
                    animationDuration: `${1 + Math.random()}s`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleClose}
            className="w-full bg-primary hover:bg-primary/90 text-black font-semibold py-3 rounded-lg transition-colors mt-6"
          >
            {type === "success" ? "Awesome!" : "Got it"}
          </button>
        </div>
      </div>
    </div>
  );
}

