"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  fetchEvents,
  registerForEvent as registerEvent,
  unregisterFromEvent as unregisterEvent,
} from "@/lib/store/slices/eventsSlice";
import { PageLoader, Loader } from "@/components/Loader";
import SuccessModal from "@/components/SuccessModal";
import AuthGuard from "@/components/AuthGuard";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Search,
  Filter,
  CheckCircle,
  X,
  TrendingUp,
  Award,
  Globe,
  Zap,
  Star,
  ArrowRight,
  Sparkles,
} from "lucide-react";

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
  createdBy: { _id?: string; name?: string; email?: string } | null;
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

  const categories = [
    "All",
    "Technology",
    "Workshop",
    "Conference",
    "Seminar",
    "Networking",
  ];

  // Single useEffect to fetch events when filters change
  useEffect(() => {
    dispatch(
      fetchEvents({
        category: selectedCategory !== "All" ? selectedCategory : undefined,
        search: searchTerm || undefined,
      })
    );
    setCurrentPage(1); // Reset to first page when filters change
  }, [selectedCategory, searchTerm, dispatch]);

  // Use events directly from Redux (already filtered by API)
  useEffect(() => {
    setFilteredEvents(events);
  }, [events]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEvents = filteredEvents.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRegister = async (eventId: string) => {
    if (!user || !isAuthenticated) {
      setModalState({
        isOpen: true,
        title: "Login Required",
        message:
          "Please login to register for events. Click 'Login' in the navigation bar to continue.",
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
        message:
          (result.payload as string) ||
          "Failed to register. The event might be full or you're already registered.",
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
        message:
          (result.payload as string) || "An error occurred. Please try again.",
        type: "error",
      });
    }
    setRegisteringId(null);
  };

  const isRegistered = (event: Event) => {
    if (!user || !event.registeredUsers) return false;
    return event.registeredUsers.some((regUser) => {
      const userId =
        typeof regUser === "string" ? regUser : regUser._id || regUser.id;
      return userId === user.id;
    });
  };

  if (loading) {
    return <PageLoader />;
  }

  // Calculate statistics
  const totalEvents = events.length;
  const totalRegistrations = events.reduce(
    (sum, event) => sum + (event.registeredUsers?.length || 0),
    0
  );
  const upcomingEvents = events.filter(
    (event) => new Date(event.date) >= new Date()
  ).length;
  const featuredEvents = events.slice(0, 3); // Top 3 events as featured

  return (
    <AuthGuard>
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 px-4 md:px-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 blur-3xl"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-light-100">
              Premier AI Event Platform
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-light-100 to-primary bg-clip-text text-transparent">
            Welcome to AI Summit
          </h1>
          <p className="text-lg md:text-xl text-light-200 max-w-3xl mx-auto mb-8 leading-relaxed">
            Connect with the brightest minds in artificial intelligence. Explore
            cutting-edge innovations, network with industry leaders, and shape
            the future of AI at our premier events.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="#events"
              className="px-8 py-4 bg-primary hover:bg-primary/90 text-black font-semibold rounded-lg transition-all transform hover:scale-105 flex items-center gap-2"
            >
              Explore Events
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/about"
              className="px-8 py-4 glass-soft hover:glass text-light-100 font-semibold rounded-lg transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 md:py-16 px-4 md:px-0">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="glass p-6 rounded-lg text-center card-shadow">
              <div className="flex items-center justify-center mb-3">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {totalEvents}
              </div>
              <div className="text-sm md:text-base text-light-200">
                Total Events
              </div>
            </div>
            <div className="glass p-6 rounded-lg text-center card-shadow">
              <div className="flex items-center justify-center mb-3">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {totalRegistrations}
              </div>
              <div className="text-sm md:text-base text-light-200">
                Registrations
              </div>
            </div>
            <div className="glass p-6 rounded-lg text-center card-shadow">
              <div className="flex items-center justify-center mb-3">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {upcomingEvents}
              </div>
              <div className="text-sm md:text-base text-light-200">
                Upcoming
              </div>
            </div>
            <div className="glass p-6 rounded-lg text-center card-shadow">
              <div className="flex items-center justify-center mb-3">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {categories.length - 1}
              </div>
              <div className="text-sm md:text-base text-light-200">
                Categories
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 px-4 md:px-0">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose AI Summit?
            </h2>
            <p className="text-light-200 max-w-2xl mx-auto">
              Join thousands of AI enthusiasts, researchers, and professionals
              in exploring the future of technology
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="glass p-6 md:p-8 rounded-lg card-shadow hover:scale-105 transition-transform">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Global Network
              </h3>
              <p className="text-light-200">
                Connect with AI professionals and researchers from around the
                world. Build meaningful connections that last.
              </p>
            </div>
            <div className="glass p-6 md:p-8 rounded-lg card-shadow hover:scale-105 transition-transform">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Cutting-Edge Content
              </h3>
              <p className="text-light-200">
                Stay ahead with the latest AI trends, breakthroughs, and
                innovations from industry-leading experts.
              </p>
            </div>
            <div className="glass p-6 md:p-8 rounded-lg card-shadow hover:scale-105 transition-transform">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Premium Experience
              </h3>
              <p className="text-light-200">
                Enjoy carefully curated events, interactive workshops, and
                exclusive networking opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      {featuredEvents.length > 0 && (
        <section className="py-12 md:py-16 px-4 md:px-0">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Featured Events
                </h2>
                <p className="text-light-200">
                  Don&apos;t miss these exciting upcoming events
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {featuredEvents.map((event) => {
                return (
                  <div
                    key={event._id}
                    className="glass p-6 rounded-lg card-shadow hover:scale-105 transition-transform relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
                    <div className="relative">
                      <div className="relative h-40 w-full rounded-lg overflow-hidden mb-4">
                        <Image
                          src={event.image}
                          alt={event.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                          loading="lazy"
                          priority={false}
                        />
                        <div className="absolute top-2 right-2">
                          <span className="px-3 py-1 bg-primary text-black text-xs font-semibold rounded-full">
                            Featured
                          </span>
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2 line-clamp-1">
                        {event.title}
                      </h3>
                      <p className="text-sm text-light-200 mb-4 line-clamp-2">
                        {event.description}
                      </p>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-light-200">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span>
                            {new Date(event.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-light-200">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      </div>
                      <Link
                        href={`/events/${event._id}`}
                        className="block w-full bg-primary hover:bg-primary/90 text-black text-center py-2 rounded-lg transition-colors text-sm font-semibold"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Main Events Section */}
      <section id="events" className="py-6 md:py-10 px-4 md:px-0">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Discover AI Events
          </h2>
          <p className="subheading text-base md:text-lg mt-2 text-light-200">
            Join cutting-edge conferences, workshops, and networking events in
            the world of AI
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
              className="w-full glass-soft rounded-lg px-10 py-3 text-white placeholder-light-200 focus:outline-none focus:glass transition-all"
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
                    : "glass-soft text-light-100 hover:glass"
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
            <p className="text-light-200 text-lg">
              No events found. Try different search terms or categories.
            </p>
          </div>
        ) : (
          <>
            <div className="events grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 px-4 md:px-0">
              {currentEvents.map((event) => {
                const registered = isRegistered(event);
                const spotsLeft = event.capacity - event.registeredUsers.length;

                return (
                  <div
                    key={event._id}
                    id="event-card"
                    className="glass p-4 md:p-6 rounded-lg card-shadow hover:scale-[1.02] md:hover:scale-105 transition-transform"
                  >
                    <div className="relative h-[180px] md:h-[200px] w-full rounded-lg overflow-hidden mb-3 md:mb-4">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                      />
                      <div className="absolute top-2 right-2">
                        <span className="pill">{event.category}</span>
                      </div>
                    </div>

                    <h3 className="title">{event.title}</h3>
                    <p className="line-clamp-2 text-sm text-light-200 mb-4">
                      {event.description}
                    </p>

                    <div className="datetime mb-4">
                      <div>
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="text-sm text-light-200">
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="text-sm text-light-200">
                          {event.time}
                        </span>
                      </div>
                      <div>
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="text-sm text-light-200">
                          {event.location}
                        </span>
                      </div>
                      <div>
                        <Users className="w-4 h-4 text-primary" />
                        <span className="text-sm text-light-200">
                          {spotsLeft} spots left
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Link
                        href={`/events/${event._id}`}
                        className="flex-1 glass-soft hover:glass text-light-100 text-center py-2 rounded-lg transition-all text-sm font-medium"
                      >
                        View Details
                      </Link>
                      {user ? (
                        <button
                          onClick={() =>
                            registered
                              ? handleUnregister(event._id)
                              : handleRegister(event._id)
                          }
                          disabled={
                            registeringId === event._id ||
                            (spotsLeft === 0 && !registered)
                          }
                          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                            registered
                              ? "bg-red-500/20 border border-red-500/50 text-red-200 hover:bg-red-500/30"
                              : "bg-primary hover:bg-primary/90 text-black"
                          }`}
                        >
                          {registeringId === event._id ? (
                            <span className="flex items-center justify-center gap-2">
                              <Loader size="sm" />
                              {registered
                                ? "Unregistering..."
                                : "Registering..."}
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
                  Showing {startIndex + 1}-
                  {Math.min(endIndex, filteredEvents.length)} of{" "}
                  {filteredEvents.length} events
                </p>
              </div>
            )}

            {currentPage > 1 && totalPages > 1 && (
              <div className="mt-12 space-y-4">
                <div className="text-center text-light-200 text-sm mb-4">
                  Showing {startIndex + 1}-
                  {Math.min(endIndex, filteredEvents.length)} of{" "}
                  {filteredEvents.length} events
                </div>

                <div className="flex justify-center items-center gap-4">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="px-6 py-3 glass-soft hover:glass text-light-100 rounded-lg transition-all flex items-center gap-2 font-semibold"
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

      {/* Our Sponsors Section */}
      <section className="py-12 md:py-16 px-4 md:px-0">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our Sponsors
            </h2>
            <p className="text-light-200 max-w-2xl mx-auto">
              Proudly supported by leading technology companies and innovators
            </p>
          </div>

          <div className="relative overflow-hidden">
            {/* Gradient overlays for fade effect */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>

            <div className="sponsors-slider">
              <div className="sponsors-track">
                {/* Sponsor data constant */}
                {(() => {
                  const sponsors = [
                    {
                      name: "Google",
                      logo: "https://logo.clearbit.com/google.com",
                    },
                    {
                      name: "Microsoft",
                      logo: "https://logo.clearbit.com/microsoft.com",
                    },
                    {
                      name: "Amazon",
                      logo: "https://logo.clearbit.com/amazon.com",
                    },
                    {
                      name: "OpenAI",
                      logo: "https://logo.clearbit.com/openai.com",
                    },
                    {
                      name: "NVIDIA",
                      logo: "https://logo.clearbit.com/nvidia.com",
                    },
                    {
                      name: "Meta",
                      logo: "https://logo.clearbit.com/meta.com",
                    },
                    {
                      name: "Apple",
                      logo: "https://logo.clearbit.com/apple.com",
                    },
                    {
                      name: "Intel",
                      logo: "https://logo.clearbit.com/intel.com",
                    },
                    {
                      name: "Tesla",
                      logo: "https://logo.clearbit.com/tesla.com",
                    },
                    {
                      name: "Salesforce",
                      logo: "https://logo.clearbit.com/salesforce.com",
                    },
                    {
                      name: "Oracle",
                      logo: "https://logo.clearbit.com/oracle.com",
                    },
                  ];

                  // Render twice for infinite scroll effect
                  return [...sponsors, ...sponsors].map((sponsor, index) => (
                    <div
                      key={`sponsor-${sponsor.name}-${index}`}
                      className="sponsor-card glass-soft flex flex-col items-center justify-center p-6 md:p-8 rounded-lg card-shadow min-w-[200px] md:min-w-[250px] mx-4 hover:scale-105 transition-transform"
                    >
                      <div className="relative w-20 h-20 md:w-24 md:h-24 mb-4 rounded-lg glass-strong flex items-center justify-center p-3 bg-white/5">
                        <Image
                          src={sponsor.logo}
                          alt={`${sponsor.name} logo`}
                          fill
                          className="object-contain p-2"
                          sizes="(max-width: 768px) 80px, 96px"
                          unoptimized
                        />
                      </div>
                      <h3 className="text-base md:text-lg font-semibold text-white text-center">
                        {sponsor.name}
                      </h3>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 md:py-16 px-4 md:px-0">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Find Us
            </h2>
            <p className="text-light-200 max-w-2xl mx-auto">
              Visit our location or get directions to our AI Summit events
            </p>
          </div>
          <div className="glass rounded-lg overflow-hidden card-shadow">
            <div className="w-full h-[400px] md:h-[500px] lg:h-[600px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8012!2d103.8528!3d1.2966!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da19f936f551ad%3A0x1a05c01c1e0d8b0!2sSingapore!5e0!3m2!1sen!2sus!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg"
              ></iframe>
            </div>
          </div>
          <div className="mt-6 text-center">
            <div className="glass-soft inline-block px-6 py-3 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-light-100">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-sm md:text-base">
                  Singapore | AI Summit Headquarters
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AuthGuard>
  );
}
