"use client";

import { useState, useEffect, useCallback } from "react";
import { RefreshCw, Shield } from "lucide-react";

interface CaptchaProps {
  onVerify: (isValid: boolean) => void;
}

export default function Captcha({ onVerify }: CaptchaProps) {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [answer, setAnswer] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState("");

  const generateCaptcha = useCallback(() => {
    const n1 = Math.floor(Math.random() * 10) + 1;
    const n2 = Math.floor(Math.random() * 10) + 1;
    setNum1(n1);
    setNum2(n2);
    setAnswer("");
    setIsValid(false);
    setError("");
    onVerify(false);
  }, [onVerify]);

  useEffect(() => {
    generateCaptcha();
  }, [generateCaptcha]);

  const handleAnswerChange = (value: string) => {
    // Only allow numbers
    if (value === "" || /^\d+$/.test(value)) {
      setAnswer(value);
      setError("");
      
      const userAnswer = parseInt(value);
      const correctAnswer = num1 + num2;
      
      if (value && userAnswer === correctAnswer) {
        setIsValid(true);
        onVerify(true);
      } else {
        setIsValid(false);
        onVerify(false);
      }
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-light-100 mb-2">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          <span>Security Verification</span>
        </div>
      </label>
      
      <div className="bg-dark-200 border border-dark-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-light-100 bg-dark-100 px-4 py-2 rounded">
              {num1}
            </span>
            <span className="text-2xl text-primary">+</span>
            <span className="text-2xl font-bold text-light-100 bg-dark-100 px-4 py-2 rounded">
              {num2}
            </span>
            <span className="text-2xl text-primary">=</span>
            <input
              type="text"
              value={answer}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder="?"
              className="w-20 text-2xl font-bold text-center bg-dark-100 border border-primary/30 rounded px-2 py-2 text-primary focus:outline-none focus:border-primary transition-colors"
              maxLength={3}
            />
          </div>
          
          <button
            type="button"
            onClick={generateCaptcha}
            className="text-light-200 hover:text-primary transition-colors p-2 hover:bg-dark-100 rounded-lg"
            title="Generate new CAPTCHA"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        
        {answer && (
          <div className="mt-2">
            {isValid ? (
              <p className="text-xs text-primary flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Verification successful
              </p>
            ) : (
              <p className="text-xs text-red-400">
                Incorrect answer. Please try again.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

