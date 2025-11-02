"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  fetchEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "@/lib/store/slices/eventsSlice";
import { fetchUsers, deleteUser } from "@/lib/store/slices/usersSlice";
import { fetchContacts, markContactAsRead, deleteContact } from "@/lib/store/slices/contactsSlice";

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

interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
}
import { PageLoader, ButtonLoader } from "@/components/Loader";
import SuccessModal from "@/components/SuccessModal";
import {
  Plus,
  Trash2,
  Edit,
  Calendar,
  Users as UsersIcon,
  TrendingUp,
  BarChart3,
  X,
  Save,
  Download,
  FileText,
  Activity,
  Mail,
  Globe,
  CheckCircle,
  Search,
  MessageSquare,
} from "lucide-react";

type TabType = "overview" | "events" | "users" | "analytics" | "forms" | "contacts";

export default function AdminDashboard() {
  const dispatch = useAppDispatch();
  const { events, loading: eventsLoading } = useAppSelector(
    (state) => state.events
  );
  const { users: allUsers, loading: usersLoading } = useAppSelector(
    (state) => state.users
  );
  const { contacts: allContacts, loading: contactsLoading, unreadCount } = useAppSelector(
    (state) => state.contacts
  );
  const { user: currentUser, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [showEventModal, setShowEventModal] = useState(false);
  const [showWebsiteModal, setShowWebsiteModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [eventFilter, setEventFilter] = useState("All");
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
  const router = useRouter();

  const loading = eventsLoading || usersLoading || contactsLoading;

  const [eventFormData, setEventFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "Technology",
    image: "",
    organizer: "",
    capacity: 100,
  });

  const [websiteFormData, setWebsiteFormData] = useState({
    name: "",
    email: "",
    website: "",
    message: "",
  });

  useEffect(() => {
    if (!isAuthenticated || !currentUser || currentUser.role !== "admin") {
      router.push("/");
      return;
    }
    dispatch(fetchEvents());
    dispatch(fetchUsers());
    dispatch(fetchContacts());
  }, [dispatch, router, isAuthenticated, currentUser]);

  // Statistics Calculations
  const totalEvents = events.length;
  const totalUsers = allUsers.length;
  const totalRegistrations = events.reduce(
    (sum, event) => sum + event.registeredUsers.length,
    0
  );
  const totalCapacity = events.reduce((sum, event) => sum + event.capacity, 0);
  const upcomingEvents = events.filter(
    (event) => new Date(event.date) >= new Date()
  ).length;
  const pastEvents = events.filter(
    (event) => new Date(event.date) < new Date()
  ).length;
  const registrationRate =
    totalCapacity > 0
      ? ((totalRegistrations / totalCapacity) * 100).toFixed(1)
      : "0";
  const activeUsers = allUsers.filter((u) => u.role === "user").length;
  const adminUsers = allUsers.filter((u) => u.role === "admin").length;

  // Category breakdown
  const categoryStats = events.reduce((acc, event) => {
    acc[event.category] = (acc[event.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // CSV Export Functions
  const exportEventsToCSV = () => {
    const headers = [
      "Title",
      "Category",
      "Date",
      "Time",
      "Location",
      "Organizer",
      "Capacity",
      "Registered",
      "Registration Rate",
    ];
    const rows = events.map((event) => [
      event.title,
      event.category,
      event.date,
      event.time,
      event.location,
      event.organizer,
      event.capacity.toString(),
      event.registeredUsers.length.toString(),
      `${((event.registeredUsers.length / event.capacity) * 100).toFixed(1)}%`,
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    downloadCSV(csv, "events-export.csv");
    setModalState({
      isOpen: true,
      title: "Export Successful! ✅",
      message: "Events data has been exported to CSV file.",
      type: "success",
    });
  };

  const exportUsersToCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Role",
      "Registered Events",
      "Account Created",
    ];
    const rows = allUsers.map((user) => {
      const registeredEvents = events.filter((e) =>
        e.registeredUsers.some(
          (regUser: any) =>
            (typeof regUser === "string"
              ? regUser
              : regUser._id || regUser.id) === (user._id || (user as any).id)
        )
      ).length;
      return [
        user.name,
        user.email,
        user.role,
        registeredEvents.toString(),
        new Date(user.createdAt).toLocaleDateString(),
      ];
    });

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    downloadCSV(csv, "users-export.csv");
    setModalState({
      isOpen: true,
      title: "Export Successful! ✅",
      message: "Users data has been exported to CSV file.",
      type: "success",
    });
  };

  const exportRegistrationsToCSV = () => {
    const headers = [
      "Event Title",
      "User Name",
      "User Email",
      "Registration Date",
      "Event Date",
    ];
    const rows: string[][] = [];

    events.forEach((event) => {
      event.registeredUsers.forEach((regUser: any) => {
        const userId =
          typeof regUser === "string" ? regUser : regUser._id || regUser.id;
        const user = allUsers.find(
          (u: any) => u._id === userId || u.id === userId
        );
        if (user) {
          rows.push([
            event.title,
            user.name,
            user.email,
            new Date().toLocaleDateString(), // Would need to track registration date
            event.date,
          ]);
        }
      });
    });

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    downloadCSV(csv, "registrations-export.csv");
    setModalState({
      isOpen: true,
      title: "Export Successful! ✅",
      message: "Registrations data has been exported to CSV file.",
      type: "success",
    });
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Event CRUD Operations
  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    setDeletingId(id);
    const result = await dispatch(deleteEvent(id));

    if (deleteEvent.fulfilled.match(result)) {
      dispatch(fetchEvents());
      setModalState({
        isOpen: true,
        title: "Event Deleted",
        message: "Event has been successfully deleted.",
        type: "success",
      });
    } else {
      setModalState({
        isOpen: true,
        title: "Error",
        message:
          (result.payload as string) ||
          "Failed to delete event. Please try again.",
        type: "error",
      });
    }
    setDeletingId(null);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setEventFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      category: event.category,
      image: event.image,
      organizer: event.organizer,
      capacity: event.capacity,
    });
    setShowEventModal(true);
  };

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingEvent) {
      const result = await dispatch(
        updateEvent({ id: editingEvent._id, updates: eventFormData })
      );
      if (updateEvent.fulfilled.match(result)) {
        dispatch(fetchEvents());
        setModalState({
          isOpen: true,
          title: "Event Updated! ✅",
          message: "Event has been successfully updated.",
          type: "success",
        });
        setShowEventModal(false);
        setEditingEvent(null);
      } else {
        setModalState({
          isOpen: true,
          title: "Error",
          message: (result.payload as string) || "Failed to update event.",
          type: "error",
        });
        return;
      }
    } else {
      const result = await dispatch(createEvent(eventFormData));
      if (createEvent.fulfilled.match(result)) {
        dispatch(fetchEvents());
        setModalState({
          isOpen: true,
          title: "Event Created! ✅",
          message: "New event has been successfully created.",
          type: "success",
        });
        setShowEventModal(false);
      } else {
        setModalState({
          isOpen: true,
          title: "Error",
          message: (result.payload as string) || "Failed to create event.",
          type: "error",
        });
        return;
      }
    }

    setEventFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      category: "Technology",
      image: "",
      organizer: "",
      capacity: 100,
    });
  };

  const openCreateEventModal = () => {
    setEditingEvent(null);
    setEventFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      category: "Technology",
      image: "",
      organizer: "",
      capacity: 100,
    });
    setShowEventModal(true);
  };

  // User CRUD Operations
  const handleDeleteUser = async (id: string) => {
    const userToDelete = allUsers.find((u: any) => u._id === id || u.id === id);
    if (!userToDelete) return;

    if (userToDelete.role === "admin") {
      setModalState({
        isOpen: true,
        title: "Cannot Delete Admin",
        message: "Admin users cannot be deleted.",
        type: "error",
      });
      return;
    }

    if (
      !confirm(`Are you sure you want to delete user "${userToDelete.name}"?`)
    )
      return;

    const result = await dispatch(deleteUser(id));

    if (deleteUser.fulfilled.match(result)) {
      dispatch(fetchUsers());
      setModalState({
        isOpen: true,
        title: "User Deleted",
        message: "User has been successfully deleted.",
        type: "success",
      });
    } else {
      setModalState({
        isOpen: true,
        title: "Error",
        message:
          (result.payload as string) ||
          "Failed to delete user. Please try again.",
        type: "error",
      });
    }
  };

  // Website Registration Form
  const handleWebsiteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Store website registration in localStorage
    const registrations = JSON.parse(
      localStorage.getItem("website_registrations") || "[]"
    );
    registrations.push({
      ...websiteFormData,
      id: Date.now(),
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem(
      "website_registrations",
      JSON.stringify(registrations)
    );

    setModalState({
      isOpen: true,
      title: "Website Registered! ✅",
      message: `Thank you, ${websiteFormData.name}. Your website registration has been submitted successfully.`,
      type: "success",
    });

    setWebsiteFormData({
      name: "",
      email: "",
      website: "",
      message: "",
    });
    setShowWebsiteModal(false);
  };

  // Filtered Events
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      eventFilter === "All" || event.category === eventFilter;
    return matchesSearch && matchesCategory;
  });

  // Filtered Users
  const filteredUsers = allUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="py-10">
      <div className="mb-6 md:mb-8 px-4 md:px-0">
        <h1 className="text-3xl md:text-4xl mb-2">Admin Dashboard</h1>
        <p className="text-light-200 text-sm md:text-base">
          Manage events, users, and view analytics
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-dark-200 px-4 md:px-0">
        <div className="flex gap-1 md:gap-2 overflow-x-auto scrollbar-hide">
          {[
            { id: "overview" as TabType, label: "Overview", icon: BarChart3 },
            { id: "events" as TabType, label: "Events", icon: Calendar },
            { id: "users" as TabType, label: "Users", icon: UsersIcon },
            {
              id: "analytics" as TabType,
              label: "Analytics",
              icon: TrendingUp,
            },
            { id: "forms" as TabType, label: "Forms", icon: FileText },
            { 
              id: "contacts" as TabType, 
              label: "Messages", 
              icon: MessageSquare,
              badge: unreadCount > 0 ? unreadCount : undefined,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 md:px-6 py-2 md:py-3 font-semibold transition-colors flex items-center gap-1 md:gap-2 border-b-2 whitespace-nowrap text-sm md:text-base ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-light-200 hover:text-primary"
                }`}
              >
                <Icon className="w-4 h-4 md:w-5 md:h-5" />
                <span>{tab.label}</span>
                {tab.badge && tab.badge > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 px-4 md:px-0">
            <div className="glass p-6 rounded-lg card-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-light-200 text-sm mb-1">Total Events</p>
                  <p className="text-3xl font-bold">{totalEvents}</p>
                  <p className="text-xs text-light-200 mt-1">
                    {upcomingEvents} upcoming, {pastEvents} past
                  </p>
                </div>
                <Calendar className="w-10 h-10 text-primary" />
              </div>
            </div>

            <div className="glass p-6 rounded-lg card-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-light-200 text-sm mb-1">Total Users</p>
                  <p className="text-3xl font-bold">{totalUsers}</p>
                  <p className="text-xs text-light-200 mt-1">
                    {activeUsers} users, {adminUsers} admins
                  </p>
                </div>
                <UsersIcon className="w-10 h-10 text-primary" />
              </div>
            </div>

            <div className="glass p-6 rounded-lg card-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-light-200 text-sm mb-1">Contact Messages</p>
                  <p className="text-3xl font-bold">{allContacts.length}</p>
                  <p className="text-xs text-light-200 mt-1">
                    {unreadCount} unread messages
                  </p>
                </div>
                <MessageSquare className="w-10 h-10 text-primary" />
              </div>
            </div>

            <div className="glass p-6 rounded-lg card-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-light-200 text-sm mb-1">
                    Total Registrations
                  </p>
                  <p className="text-3xl font-bold">{totalRegistrations}</p>
                  <p className="text-xs text-light-200 mt-1">
                    {registrationRate}% registration rate
                  </p>
                </div>
                <Activity className="w-10 h-10 text-primary" />
              </div>
            </div>

            <div className="glass p-6 rounded-lg card-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-light-200 text-sm mb-1">Total Capacity</p>
                  <p className="text-3xl font-bold">
                    {totalCapacity.toLocaleString()}
                  </p>
                  <p className="text-xs text-light-200 mt-1">
                    Across all events
                  </p>
                </div>
                <TrendingUp className="w-10 h-10 text-primary" />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass p-6 rounded-lg card-shadow">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => {
                  setActiveTab("events");
                  openCreateEventModal();
                }}
                className="bg-primary hover:bg-primary/90 text-black font-semibold px-4 py-3 rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Event
              </button>
              <button
                onClick={exportEventsToCSV}
                className="bg-dark-200 hover:bg-dark-100 text-light-100 font-semibold px-4 py-3 rounded-lg transition-colors flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Export Events
              </button>
              <button
                onClick={exportUsersToCSV}
                className="bg-dark-200 hover:bg-dark-100 text-light-100 font-semibold px-4 py-3 rounded-lg transition-colors flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Export Users
              </button>
              <button
                onClick={exportRegistrationsToCSV}
                className="bg-dark-200 hover:bg-dark-100 text-light-100 font-semibold px-4 py-3 rounded-lg transition-colors flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Export Registrations
              </button>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="glass p-6 rounded-lg card-shadow">
            <h2 className="text-xl font-bold mb-4">Events by Category</h2>
            <div className="grid md:grid-cols-5 gap-4">
              {Object.entries(categoryStats).map(([category, count]) => (
                <div
                  key={category}
                  className="text-center p-4 bg-dark-100 rounded-lg"
                >
                  <p className="text-2xl font-bold text-primary">{count}</p>
                  <p className="text-sm text-light-200 mt-1">{category}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Events Tab */}
      {activeTab === "events" && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex-1 flex gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-light-200" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-dark-100 border border-dark-200 rounded-lg px-10 py-2 text-white placeholder-light-200 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <select
                value={eventFilter}
                onChange={(e) => setEventFilter(e.target.value)}
                className="bg-dark-100 border border-dark-200 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors"
              >
                <option value="All">All Categories</option>
                <option value="Technology">Technology</option>
                <option value="Workshop">Workshop</option>
                <option value="Conference">Conference</option>
                <option value="Seminar">Seminar</option>
                <option value="Networking">Networking</option>
              </select>
            </div>
            <button
              onClick={openCreateEventModal}
              className="bg-primary hover:bg-primary/90 text-black font-semibold px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Event
            </button>
          </div>

          <div className="space-y-4">
            {filteredEvents.length === 0 ? (
              <div className="glass p-12 rounded-lg card-shadow text-center">
                <Calendar className="w-16 h-16 text-light-200 mx-auto mb-4" />
                <p className="text-light-200 text-lg">No events found.</p>
              </div>
            ) : (
              filteredEvents.map((event) => (
                <div
                  key={event._id}
                  className="glass p-6 rounded-lg card-shadow hover:bg-dark-100/50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="relative h-[200px] md:w-[300px] w-full rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 300px"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="pill">{event.category}</span>
                            <span className="text-light-200 text-sm">
                              {new Date(event.date).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="text-2xl font-bold mb-2">
                            {event.title}
                          </h3>
                          <p className="text-light-200 line-clamp-2 mb-4">
                            {event.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 mb-4 text-sm text-light-200">
                        <span>📍 {event.location}</span>
                        <span>
                          👥 {event.registeredUsers.length} / {event.capacity}
                        </span>
                        <span>
                          📊{" "}
                          {(
                            (event.registeredUsers.length / event.capacity) *
                            100
                          ).toFixed(1)}
                          % filled
                        </span>
                      </div>

                      <div className="flex gap-3">
                        <Link
                          href={`/events/${event._id}`}
                          className="bg-dark-200 hover:bg-dark-100 text-light-100 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleEditEvent(event)}
                          className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-200 px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event._id)}
                          disabled={deletingId === event._id}
                          className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-200 px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                        >
                          {deletingId === event._id ? (
                            <>
                              <ButtonLoader />
                              Deleting...
                            </>
                          ) : (
                            <>
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="space-y-6">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-light-200" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-dark-100 border border-dark-200 rounded-lg px-10 py-2 text-white placeholder-light-200 focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div className="glass p-6 rounded-lg card-shadow overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-200">
                  <th className="text-left py-3 px-4 text-light-100 font-semibold">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 text-light-100 font-semibold">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 text-light-100 font-semibold">
                    Role
                  </th>
                  <th className="text-left py-3 px-4 text-light-100 font-semibold">
                    Registered Events
                  </th>
                  <th className="text-left py-3 px-4 text-light-100 font-semibold">
                    Joined
                  </th>
                  <th className="text-left py-3 px-4 text-light-100 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const registeredEvents = events.filter((e) =>
                    e.registeredUsers.some(
                      (regUser: any) =>
                        (typeof regUser === "string"
                          ? regUser
                          : regUser._id || regUser.id) === (user._id || (user as any).id)
                    )
                  ).length;
                  return (
                    <tr
                      key={user._id}
                      className="border-b border-dark-200/50 hover:bg-dark-100/50"
                    >
                      <td className="py-3 px-4 text-light-100">{user.name}</td>
                      <td className="py-3 px-4 text-light-200">{user.email}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`pill ${
                            user.role === "admin"
                              ? "bg-primary/20 text-primary"
                              : ""
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-light-200">
                        {registeredEvents}
                      </td>
                      <td className="py-3 px-4 text-light-200 text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        {user.role !== "admin" && (
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-200 px-3 py-1 rounded-lg transition-colors text-sm font-medium flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Registration Chart */}
            <div className="glass p-6 rounded-lg card-shadow">
              <h2 className="text-xl font-bold mb-4">Registration Trends</h2>
              <div className="space-y-3">
                {events.slice(0, 5).map((event) => {
                  const percentage =
                    (event.registeredUsers.length / event.capacity) * 100;
                  return (
                    <div key={event._id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-light-200 truncate max-w-[200px]">
                          {event.title}
                        </span>
                        <span className="text-primary font-semibold">
                          {percentage.toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-dark-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Events */}
            <div className="glass p-6 rounded-lg card-shadow">
              <h2 className="text-xl font-bold mb-4">Top Events</h2>
              <div className="space-y-3">
                {[...events]
                  .sort(
                    (a, b) =>
                      b.registeredUsers.length - a.registeredUsers.length
                  )
                  .slice(0, 5)
                  .map((event, index) => (
                    <div
                      key={event._id}
                      className="flex items-center justify-between p-3 bg-dark-100 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-primary w-8">
                          #{index + 1}
                        </span>
                        <div>
                          <p className="text-light-100 font-semibold">
                            {event.title}
                          </p>
                          <p className="text-xs text-light-200">
                            {event.registeredUsers.length} registrations
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Category Performance */}
          <div className="glass p-6 rounded-lg card-shadow">
            <h2 className="text-xl font-bold mb-4">Category Performance</h2>
            <div className="grid md:grid-cols-5 gap-4">
              {Object.entries(categoryStats).map(([category, count]) => {
                const categoryEvents = events.filter(
                  (e) => e.category === category
                );
                const totalRegs = categoryEvents.reduce(
                  (sum, e) => sum + e.registeredUsers.length,
                  0
                );
                const avgRegs =
                  count > 0 ? (totalRegs / count).toFixed(1) : "0";
                return (
                  <div
                    key={category}
                    className="p-4 bg-dark-100 rounded-lg text-center"
                  >
                    <p className="text-3xl font-bold text-primary">{count}</p>
                    <p className="text-sm text-light-200 mt-1">{category}</p>
                    <p className="text-xs text-light-200 mt-2">
                      Avg: {avgRegs} regs/event
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Forms Tab */}
      {activeTab === "forms" && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Event Registration Form */}
          <div className="glass p-6 rounded-lg card-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Event Registration Form
              </h2>
              <button
                onClick={openCreateEventModal}
                className="bg-primary hover:bg-primary/90 text-black font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm"
              >
                <Plus className="w-4 h-4" />
                New Event
              </button>
            </div>
            <p className="text-light-200 text-sm mb-4">
              Use this form to quickly register a new event. All fields are
              required.
            </p>
            <div className="space-y-3">
              <div className="p-4 bg-dark-100 rounded-lg">
                <p className="text-light-200 text-sm mb-2">
                  Quick Event Creation
                </p>
                <p className="text-xs text-light-200">
                  Click &quot;New Event&quot; button to open the event creation
                  form. Fill in all details including title, description, date,
                  time, location, category, organizer, capacity, and image URL.
                </p>
              </div>
            </div>
          </div>

          {/* Website Registration Form */}
          <div className="glass p-6 rounded-lg card-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                Website Registration Form
              </h2>
              <button
                onClick={() => setShowWebsiteModal(true)}
                className="bg-primary hover:bg-primary/90 text-black font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm"
              >
                <Globe className="w-4 h-4" />
                Register Website
              </button>
            </div>
            <p className="text-light-200 text-sm mb-4">
              Register websites interested in partnering or listing their
              events.
            </p>
            <div className="space-y-3">
              <div className="p-4 bg-dark-100 rounded-lg">
                <p className="text-light-200 text-sm mb-2">
                  Website Partnership
                </p>
                <p className="text-xs text-light-200">
                  Click &quot;Register Website&quot; to submit website
                  registration. Include website URL, contact information, and
                  partnership details.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/70 flex-center z-50 p-4">
          <div className="glass p-8 rounded-lg card-shadow w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {editingEvent ? "Edit Event" : "Create New Event"}
              </h2>
              <button
                onClick={() => {
                  setShowEventModal(false);
                  setEditingEvent(null);
                }}
                className="text-light-200 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleEventSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-light-100 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={eventFormData.title}
                  onChange={(e) =>
                    setEventFormData({
                      ...eventFormData,
                      title: e.target.value,
                    })
                  }
                  className="w-full bg-dark-200 border border-dark-200 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-light-100 mb-2">
                  Description
                </label>
                <textarea
                  required
                  rows={4}
                  value={eventFormData.description}
                  onChange={(e) =>
                    setEventFormData({
                      ...eventFormData,
                      description: e.target.value,
                    })
                  }
                  className="w-full bg-dark-200 border border-dark-200 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-light-100 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={eventFormData.date}
                    onChange={(e) =>
                      setEventFormData({
                        ...eventFormData,
                        date: e.target.value,
                      })
                    }
                    className="w-full bg-dark-200 border border-dark-200 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-light-100 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    required
                    value={eventFormData.time}
                    onChange={(e) =>
                      setEventFormData({
                        ...eventFormData,
                        time: e.target.value,
                      })
                    }
                    className="w-full bg-dark-200 border border-dark-200 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-light-100 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  required
                  value={eventFormData.location}
                  onChange={(e) =>
                    setEventFormData({
                      ...eventFormData,
                      location: e.target.value,
                    })
                  }
                  className="w-full bg-dark-200 border border-dark-200 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-light-100 mb-2">
                    Category
                  </label>
                  <select
                    required
                    value={eventFormData.category}
                    onChange={(e) =>
                      setEventFormData({
                        ...eventFormData,
                        category: e.target.value,
                      })
                    }
                    className="w-full bg-dark-200 border border-dark-200 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Conference">Conference</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Networking">Networking</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-light-100 mb-2">
                    Capacity
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={eventFormData.capacity}
                    onChange={(e) =>
                      setEventFormData({
                        ...eventFormData,
                        capacity: parseInt(e.target.value),
                      })
                    }
                    className="w-full bg-dark-200 border border-dark-200 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-light-100 mb-2">
                  Organizer
                </label>
                <input
                  type="text"
                  required
                  value={eventFormData.organizer}
                  onChange={(e) =>
                    setEventFormData({
                      ...eventFormData,
                      organizer: e.target.value,
                    })
                  }
                  className="w-full bg-dark-200 border border-dark-200 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-light-100 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  required
                  value={eventFormData.image}
                  onChange={(e) =>
                    setEventFormData({
                      ...eventFormData,
                      image: e.target.value,
                    })
                  }
                  placeholder="https://picsum.photos/seed/123/800/600"
                  className="w-full bg-dark-200 border border-dark-200 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90 text-black font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {editingEvent ? "Update Event" : "Create Event"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEventModal(false);
                    setEditingEvent(null);
                  }}
                  className="bg-dark-200 hover:bg-dark-100 text-light-100 font-semibold py-3 rounded-lg transition-colors px-6"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contacts Tab */}
      {activeTab === "contacts" && (
        <div className="space-y-6 px-4 md:px-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">Contact Messages</h2>
              <p className="text-light-200">
                {allContacts.length} total messages, {unreadCount} unread
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => dispatch(fetchContacts({ read: false }))}
                className="bg-dark-200 hover:bg-dark-100 text-light-100 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                Unread Only
              </button>
              <button
                onClick={() => dispatch(fetchContacts())}
                className="bg-primary hover:bg-primary/90 text-black px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                All Messages
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {allContacts.length === 0 ? (
              <div className="glass p-12 rounded-lg card-shadow text-center">
                <MessageSquare className="w-16 h-16 text-light-200 mx-auto mb-4 opacity-50" />
                <p className="text-light-200 text-lg">No contact messages yet</p>
              </div>
            ) : (
              allContacts.map((contact: any) => (
                <div
                  key={contact._id}
                  className={`glass p-6 rounded-lg card-shadow border-l-4 ${
                    !contact.read ? "border-primary" : "border-dark-200"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{contact.subject}</h3>
                        {!contact.read && (
                          <span className="bg-primary text-black text-xs font-bold px-2 py-1 rounded">
                            NEW
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-light-200">
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          <span>{contact.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>{contact.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(contact.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!contact.read && (
                        <button
                          onClick={async () => {
                            await dispatch(markContactAsRead({ id: contact._id, read: true }));
                            dispatch(fetchContacts());
                          }}
                          className="bg-primary/20 hover:bg-primary/30 border border-primary/50 text-primary px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                        >
                          Mark Read
                        </button>
                      )}
                      <button
                        onClick={async () => {
                          if (confirm("Are you sure you want to delete this message?")) {
                            await dispatch(deleteContact(contact._id));
                            dispatch(fetchContacts());
                            setModalState({
                              isOpen: true,
                              title: "Message Deleted",
                              message: "Contact message has been deleted successfully.",
                              type: "success",
                            });
                          }
                        }}
                        className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-200 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="bg-dark-100 rounded-lg p-4">
                    <p className="text-light-100 whitespace-pre-wrap">{contact.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Website Registration Modal */}
      {showWebsiteModal && (
        <div className="fixed inset-0 bg-black/70 flex-center z-50 p-4">
          <div className="glass p-8 rounded-lg card-shadow w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Globe className="w-6 h-6 text-primary" />
                Website Registration
              </h2>
              <button
                onClick={() => setShowWebsiteModal(false)}
                className="text-light-200 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleWebsiteSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-light-100 mb-2">
                  Website Name
                </label>
                <input
                  type="text"
                  required
                  value={websiteFormData.name}
                  onChange={(e) =>
                    setWebsiteFormData({
                      ...websiteFormData,
                      name: e.target.value,
                    })
                  }
                  className="w-full bg-dark-200 border border-dark-200 rounded-lg px-4 py-3 text-white placeholder-light-200 focus:outline-none focus:border-primary transition-colors"
                  placeholder="Your website or organization name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-light-100 mb-2">
                  Contact Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-light-200" />
                  <input
                    type="email"
                    required
                    value={websiteFormData.email}
                    onChange={(e) =>
                      setWebsiteFormData({
                        ...websiteFormData,
                        email: e.target.value,
                      })
                    }
                    className="w-full bg-dark-200 border border-dark-200 rounded-lg px-10 py-3 text-white placeholder-light-200 focus:outline-none focus:border-primary transition-colors"
                    placeholder="contact@website.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-light-100 mb-2">
                  Website URL
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-light-200" />
                  <input
                    type="url"
                    required
                    value={websiteFormData.website}
                    onChange={(e) =>
                      setWebsiteFormData({
                        ...websiteFormData,
                        website: e.target.value,
                      })
                    }
                    className="w-full bg-dark-200 border border-dark-200 rounded-lg px-10 py-3 text-white placeholder-light-200 focus:outline-none focus:border-primary transition-colors"
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-light-100 mb-2">
                  Message / Partnership Details
                </label>
                <textarea
                  required
                  rows={4}
                  value={websiteFormData.message}
                  onChange={(e) =>
                    setWebsiteFormData({
                      ...websiteFormData,
                      message: e.target.value,
                    })
                  }
                  className="w-full bg-dark-200 border border-dark-200 rounded-lg px-4 py-3 text-white placeholder-light-200 focus:outline-none focus:border-primary transition-colors"
                  placeholder="Tell us about your website and how you'd like to partner..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90 text-black font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Submit Registration
                </button>
                <button
                  type="button"
                  onClick={() => setShowWebsiteModal(false)}
                  className="bg-dark-200 hover:bg-dark-100 text-light-100 font-semibold py-3 rounded-lg transition-colors px-6"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
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
          ) : (
            <X className="w-16 h-16 text-red-500" />
          )
        }
      />
    </div>
  );
}
