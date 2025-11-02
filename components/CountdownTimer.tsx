"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  targetDate: Date;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference <= 0) {
        setIsExpired(true);
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    };

    // Calculate immediately
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (isExpired || (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0)) {
    return (
      <div className="text-center py-6">
        <Clock className="w-12 h-12 text-primary/50 mx-auto mb-3" />
        <p className="text-light-200 text-lg">Event has started or passed</p>
      </div>
    );
  }

  const timeUnits = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        {timeUnits.map((unit, index) => (
          <div
            key={index}
            className="glass-soft p-4 rounded-lg text-center border border-primary/20"
          >
            <div className="text-3xl font-bold text-primary mb-1">
              {unit.value.toString().padStart(2, "0")}
            </div>
            <div className="text-xs text-light-200 uppercase tracking-wider">
              {unit.label}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-2 text-light-200 text-sm">
        <Clock className="w-4 h-4 text-primary" />
        <span>
          {timeLeft.days > 0 && `${timeLeft.days} day${timeLeft.days !== 1 ? "s" : ""} `}
          {timeLeft.hours > 0 && `${timeLeft.hours} hour${timeLeft.hours !== 1 ? "s" : ""} `}
          {timeLeft.minutes > 0 && `${timeLeft.minutes} minute${timeLeft.minutes !== 1 ? "s" : ""} `}
          until event
        </span>
      </div>
    </div>
  );
}

