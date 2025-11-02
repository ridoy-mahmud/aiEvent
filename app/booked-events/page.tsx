"use client";

import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { fetchEvents } from "@/lib/store/slices/eventsSlice";
import { PageLoader, Loader } from "@/components/Loader";
import AuthGuard from "@/components/AuthGuard";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import CountdownTimer from "@/components/CountdownTimer";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  image: string;
  organizer: string;
  capacity: number;
  registeredUsers: Array<{ _id?: string; id?: string } | string>;
  createdAt: string;
}

export default function BookedEventsPage() {
  const dispatch = useAppDispatch();
  const { events, loading } = useAppSelector((state) => state.events);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [bookedEvents, setBookedEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchEvents({}));
    }
  }, [dispatch, isAuthenticated]);

  // Filter events where user has registered
  useEffect(() => {
    if (user && events.length > 0) {
      const userId = user.id;
      const filtered = events.filter((event) => {
        return event.registeredUsers.some((regUser) => {
          const regUserId =
            typeof regUser === "string"
              ? regUser
              : regUser._id || regUser.id;
          return regUserId === userId;
        });
      });
      setBookedEvents(filtered);
    }
  }, [events, user]);

  if (!isAuthenticated) {
    return <AuthGuard><div></div></AuthGuard>;
  }

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-3">
            My Booked Events
          </h1>
          <p className="text-light-200 text-lg">
            View your registered events and track countdown timers
          </p>
        </div>

        {/* Booked Events List */}
        {bookedEvents.length === 0 ? (
          <div className="glass-strong p-12 rounded-lg card-shadow text-center">
            <Calendar className="w-16 h-16 text-light-200/50 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-light-100 mb-2">
              No Booked Events Yet
            </h3>
            <p className="text-light-200 mb-6">
              You haven't registered for any events yet.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-black font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Browse Events
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookedEvents.map((event) => {
              const spotsLeft = event.capacity - event.registeredUsers.length;
              const eventDateTime = new Date(`${event.date}T${event.time}`);

              return (
                <div
                  key={event._id}
                  className="glass-strong rounded-lg card-shadow overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row gap-6 p-6">
                    {/* Left Column - Event Info */}
                    <div className="space-y-4">
                      {/* Event Image */}
                      <div className="relative h-[200px] w-full rounded-lg overflow-hidden">
                        <Image
                          src={event.image}
                          alt={event.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute top-3 right-3">
                          <span className="pill">{event.category}</span>
                        </div>
                      </div>

                      {/* Event Title & Description */}
                      <div>
                        <h2 className="text-2xl font-bold text-light-100 mb-2">
                          {event.title}
                        </h2>
                        <p className="text-light-200 line-clamp-3">
                          {event.description}
                        </p>
                      </div>

                      {/* Event Details */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-light-200">
                          <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
                          <span>
                            {new Date(event.date).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-light-200">
                          <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-light-200">
                          <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-light-200">
                          <Users className="w-5 h-5 text-primary flex-shrink-0" />
                          <span>
                            {spotsLeft > 0
                              ? `${spotsLeft} spots left`
                              : "Fully booked"}
                          </span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Link
                        href={`/events/${event._id}`}
                        className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-black font-semibold px-6 py-3 rounded-lg transition-colors"
                      >
                        View Full Details
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>

                    {/* Right Column - Countdown Timer */}
                    <div className="md:w-[400px] flex-shrink-0">
                      <div className="glass-soft p-6 rounded-lg">
                        <h3 className="text-xl font-semibold text-light-100 mb-4">
                          Event Countdown
                        </h3>
                        <CountdownTimer targetDate={eventDateTime} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

