"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchEventById, registerForEvent, unregisterFromEvent } from "@/lib/store/slices/eventsSlice";
import { PageLoader, ButtonLoader } from "@/components/Loader";
import SuccessModal from "@/components/SuccessModal";
import { Calendar, Clock, MapPin, Users, ArrowLeft, User as UserIcon, CheckCircle, X } from "lucide-react";

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
  registeredUsers: any[];
  createdBy: any;
  createdAt: string;
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { event, loading } = useAppSelector((state) => state.events);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [registering, setRegistering] = useState(false);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "success" | "error" | "info";
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
  });

  useEffect(() => {
    if (params.id) {
      dispatch(fetchEventById(params.id as string));
    }
  }, [params.id, dispatch]);

  const handleRegister = async () => {
    if (!user || !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!event) return;

    setRegistering(true);
    const result = await dispatch(registerForEvent(event._id));
    
    if (registerForEvent.fulfilled.match(result)) {
      const updatedEvent = result.payload;
      setModalState({
        isOpen: true,
        title: "Registration Successful! 🎉",
        message: `😊 You've successfully registered for "${updatedEvent.title}". We look forward to seeing you on ${new Date(updatedEvent.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}!`,
        type: "success",
      });
    } else {
      setModalState({
        isOpen: true,
        title: "Registration Failed",
        message: result.payload as string || "Failed to register. The event might be full or you're already registered.",
        type: "error",
      });
    }
    setRegistering(false);
  };

  const handleUnregister = async () => {
    if (!user || !isAuthenticated || !event) return;

    setRegistering(true);
    const result = await dispatch(unregisterFromEvent(event._id));
    
    if (unregisterFromEvent.fulfilled.match(result)) {
      const updatedEvent = result.payload;
      setModalState({
        isOpen: true,
        title: "Unregistered Successfully",
        message: `😢 You've unregistered from "${updatedEvent.title}". You can register again anytime!`,
        type: "error",
      });
    } else {
      setModalState({
        isOpen: true,
        title: "Error",
        message: result.payload as string || "An error occurred. Please try again.",
        type: "error",
      });
    }
    setRegistering(false);
  };

  const isRegistered = () => {
    if (!user || !event || !event.registeredUsers) return false;
    return event.registeredUsers.some((regUser: any) => 
      (typeof regUser === 'string' ? regUser : regUser._id || regUser.id) === user.id
    );
  };

  if (loading) {
    return <PageLoader />;
  }

  if (!event) {
    return (
      <div className="flex-center min-h-screen">
        <div className="text-center">
          <p className="text-light-200 text-lg mb-4">Event not found</p>
          <Link href="/" className="text-primary hover:underline">
            Go back to events
          </Link>
        </div>
      </div>
    );
  }

  const spotsLeft = event.capacity - event.registeredUsers.length;
  const registered = isRegistered();

  return (
    <div id="event" className="py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-light-200 hover:text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Events
      </Link>

      <div className="header">
        <div className="flex items-center gap-3 mb-4">
          <span className="pill">{event.category}</span>
          <span className="text-light-200 text-sm">by {event.organizer}</span>
        </div>
        <h1 className="text-4xl mb-4">{event.title}</h1>
      </div>

      <div className="details">
        <div className="content">
          <div className="relative w-full h-[400px] rounded-lg overflow-hidden mb-8">
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>

          <div className="space-y-6">
            <div>
              <h2>About This Event</h2>
              <p className="mt-2">{event.description}</p>
            </div>

            <div>
              <h2>Event Details</h2>
              <div className="mt-4 space-y-3">
                <div className="flex-row-gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <p>
                    <span className="font-semibold">Date:</span>{" "}
                    {new Date(event.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex-row-gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <p>
                    <span className="font-semibold">Time:</span> {event.time}
                  </p>
                </div>
                <div className="flex-row-gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <p>
                    <span className="font-semibold">Location:</span> {event.location}
                  </p>
                </div>
                <div className="flex-row-gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <p>
                    <span className="font-semibold">Capacity:</span> {event.registeredUsers.length} / {event.capacity} registered
                    {spotsLeft > 0 && ` (${spotsLeft} spots left)`}
                  </p>
                </div>
              </div>
            </div>

            {registered && (
              <div className="bg-primary/20 border border-primary/50 rounded-lg p-4">
                <p className="text-primary font-semibold flex items-center gap-2">
                  <UserIcon className="w-5 h-5" />
                  You are registered for this event!
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="booking">
          <div className="signup-card">
            <h2 className="mb-4">Register Now</h2>
            <p className="text-light-200 mb-6">
              {spotsLeft > 0
                ? `Join ${event.registeredUsers.length} other attendees at this exciting event.`
                : "This event is full. Check back for cancellations."}
            </p>

            {user ? (
              <div className="space-y-4">
                <button
                  onClick={registered ? handleUnregister : handleRegister}
                  disabled={registering || (spotsLeft === 0 && !registered)}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                    registered
                      ? "bg-red-500/20 border border-red-500/50 text-red-200 hover:bg-red-500/30"
                      : "bg-primary hover:bg-primary/90 text-black"
                  }`}
                >
                  {registering ? (
                    <>
                      <ButtonLoader />
                      {registered ? "Unregistering..." : "Registering..."}
                    </>
                  ) : registered ? (
                    "Unregister"
                  ) : spotsLeft === 0 ? (
                    "Event Full"
                  ) : (
                    "Register for Event"
                  )}
                </button>
                <p className="text-xs text-light-200 text-center">
                  You are logged in as {user.name}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-light-200 text-sm text-center">
                  Please login to register for this event
                </p>
                <Link
                  href="/login"
                  className="block w-full bg-primary hover:bg-primary/90 text-black text-center py-3 rounded-lg font-semibold transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block w-full bg-dark-200 hover:bg-dark-100 text-light-100 text-center py-3 rounded-lg font-semibold transition-colors"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <SuccessModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        icon={
          modalState.type === "success" ? (
            <CheckCircle className="w-16 h-16 text-primary" />
          ) : modalState.type === "error" ? (
            <X className="w-16 h-16 text-red-500" />
          ) : (
            <Calendar className="w-16 h-16 text-primary" />
          )
        }
      />
    </div>
  );
}

