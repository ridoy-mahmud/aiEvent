"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchEvents, registerForEvent as registerEvent, unregisterFromEvent as unregisterEvent } from "@/lib/store/slices/eventsSlice";
import { PageLoader, Loader } from "@/components/Loader";
import SuccessModal from "@/components/SuccessModal";
import AuthGuard from "@/components/AuthGuard";
import { Calendar, Clock, MapPin, Users, Search, Filter, CheckCircle, X } from "lucide-react";

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

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { events, loading } = useAppSelector((state) => state.events);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [registeringId, setRegisteringId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
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

  const categories = ["All", "Technology", "Workshop", "Conference", "Seminar", "Networking"];

  useEffect(() => {
    // Fetch events from API
    dispatch(fetchEvents({ category: selectedCategory !== "All" ? selectedCategory : undefined, search: searchTerm || undefined }));
  }, [dispatch]);
  
  // Also fetch when filters change
  useEffect(() => {
    dispatch(fetchEvents({ category: selectedCategory !== "All" ? selectedCategory : undefined, search: searchTerm || undefined }));
  }, [selectedCategory, searchTerm, dispatch]);

  useEffect(() => {
    let filtered = events;

    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter((event) => event.category === selectedCategory);
    }

    setFilteredEvents(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, selectedCategory, events]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEvents = filteredEvents.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegister = async (eventId: string) => {
    if (!user || !isAuthenticated) {
      setModalState({
        isOpen: true,
        title: "Login Required",
        message: "Please login to register for events. Click 'Login' in the navigation bar to continue.",
        type: "info",
      });
      return;
    }

    setRegisteringId(eventId);
    const result = await dispatch(registerEvent(eventId));
    
    if (registerEvent.fulfilled.match(result)) {
      const event = result.payload;
      setModalState({
        isOpen: true,
        title: "Registration Successful! 🎉",
        message: `😊 You've successfully registered for "${event.title}". We look forward to seeing you there!`,
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
    setRegisteringId(null);
  };

  const handleUnregister = async (eventId: string) => {
    if (!user || !isAuthenticated) return;

    setRegisteringId(eventId);
    const result = await dispatch(unregisterEvent(eventId));
    
    if (unregisterEvent.fulfilled.match(result)) {
      const event = result.payload;
      setModalState({
        isOpen: true,
        title: "Unregistered Successfully",
        message: `😢 You've unregistered from "${event.title}". You can register again anytime!`,
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
    setRegisteringId(null);
  };

  const isRegistered = (event: Event) => {
    if (!user || !event.registeredUsers) return false;
    return event.registeredUsers.some((regUser: any) => 
      (typeof regUser === 'string' ? regUser : regUser._id || regUser.id) === user.id
    );
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <AuthGuard>
      <section id="home" className="py-6 md:py-10 px-4 md:px-0">
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl">Discover AI Events</h1>
        <p className="subheading text-base md:text-lg mt-2">
          Join cutting-edge conferences, workshops, and networking events in the world of AI
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 md:mb-10 space-y-4 px-4 md:px-0">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-light-200" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-dark-100 border border-dark-200 rounded-lg px-10 py-3 text-white placeholder-light-200 focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 px-4">
          <Filter className="w-4 h-4 md:w-5 md:h-5 text-light-200" />
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-primary text-black"
                  : "bg-dark-100 text-light-100 hover:bg-dark-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-light-200 text-lg">No events found. Try different search terms or categories.</p>
        </div>
      ) : (
        <>
          <div className="events grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 px-4 md:px-0">
            {currentEvents.map((event) => {
            const registered = isRegistered(event);
            const spotsLeft = event.capacity - event.registeredUsers.length;
            
            return (
              <div key={event._id} id="event-card" className="glass p-4 md:p-6 rounded-lg card-shadow hover:scale-[1.02] md:hover:scale-105 transition-transform">
                <div className="relative h-[180px] md:h-[200px] w-full rounded-lg overflow-hidden mb-3 md:mb-4">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="pill">{event.category}</span>
                  </div>
                </div>

                <h3 className="title">{event.title}</h3>
                <p className="line-clamp-2 text-sm text-light-200 mb-4">{event.description}</p>

                <div className="datetime mb-4">
                  <div>
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-sm text-light-200">{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-sm text-light-200">{event.time}</span>
                  </div>
                  <div>
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-sm text-light-200">{event.location}</span>
                  </div>
                  <div>
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-sm text-light-200">{spotsLeft} spots left</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link
                    href={`/events/${event._id}`}
                    className="flex-1 bg-dark-200 hover:bg-dark-100 text-light-100 text-center py-2 rounded-lg transition-colors text-sm font-medium"
                  >
                    View Details
                  </Link>
                  {user ? (
                    <button
                      onClick={() => registered ? handleUnregister(event._id) : handleRegister(event._id)}
                      disabled={registeringId === event._id || spotsLeft === 0 && !registered}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        registered
                          ? "bg-red-500/20 border border-red-500/50 text-red-200 hover:bg-red-500/30"
                          : "bg-primary hover:bg-primary/90 text-black"
                      }`}
                    >
                      {registeringId === event._id ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader size="sm" />
                          {registered ? "Unregistering..." : "Registering..."}
                        </span>
                      ) : registered ? (
                        "Unregister"
                      ) : spotsLeft === 0 ? (
                        "Full"
                      ) : (
                        "Register"
                      )}
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      className="flex-1 bg-primary hover:bg-primary/90 text-black text-center py-2 rounded-lg transition-colors text-sm font-medium"
                    >
                      Login to Register
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
          </div>

          {/* Pagination Controls */}
          {currentPage === 1 && totalPages > 1 && (
            <div className="mt-12 text-center">
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-8 py-4 bg-primary hover:bg-primary/90 text-black font-semibold rounded-lg transition-colors text-lg"
              >
                Show More Events
              </button>
              <p className="text-light-200 text-sm mt-4">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredEvents.length)} of {filteredEvents.length} events
              </p>
            </div>
          )}

          {currentPage > 1 && totalPages > 1 && (
            <div className="mt-12 space-y-4">
              <div className="text-center text-light-200 text-sm mb-4">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredEvents.length)} of {filteredEvents.length} events
              </div>
              
              <div className="flex justify-center items-center gap-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="px-6 py-3 bg-dark-100 hover:bg-dark-200 text-light-100 rounded-lg transition-colors flex items-center gap-2 font-semibold"
                >
                  ← Previous
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-light-200">Page</span>
                  <span className="bg-primary text-black font-bold px-4 py-2 rounded-lg">
                    {currentPage}
                  </span>
                  <span className="text-light-200">of {totalPages}</span>
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-6 py-3 bg-dark-100 hover:bg-dark-200 text-light-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-semibold"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </>
      )}

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
    </section>
    </AuthGuard>
  );
}
