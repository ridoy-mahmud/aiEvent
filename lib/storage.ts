// localStorage utility for managing user authentication and events

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: "user" | "admin";
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  image: string;
  organizer: string;
  capacity: number;
  registeredUsers: string[];
  createdBy: string;
  createdAt: string;
}

const USERS_KEY = "ai_event_users";
const EVENTS_KEY = "ai_event_events";
const CURRENT_USER_KEY = "ai_event_current_user";

// Initialize default admin user if none exists
export const initializeDefaultAdmin = () => {
  if (typeof window === "undefined") return;

  const users = getUsers();
  const specificAdminExists = users.some(
    (u) => u.email === "ridoy007@gmail.com"
  );

  if (!specificAdminExists) {
    // Check if there's already an admin user and update it, or create new one
    const existingAdmin = users.find((u) => u.role === "admin");

    if (existingAdmin) {
      // Update existing admin to use the correct credentials
      const adminIndex = users.findIndex((u) => u.id === existingAdmin.id);
      users[adminIndex] = {
        ...existingAdmin,
        email: "ridoy007@gmail.com",
        password: "ridoy007",
        name: "Admin User",
        role: "admin",
      };
    } else {
      // Create new admin user
      const adminUser: User = {
        id: "admin-1",
        email: "ridoy007@gmail.com",
        password: "ridoy007",
        name: "Admin User",
        role: "admin",
        createdAt: new Date().toISOString(),
      };
      users.push(adminUser);
    }

    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
};

// User management
export const getUsers = (): User[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveUser = (user: Omit<User, "id" | "createdAt">): User => {
  const users = getUsers();
  const newUser: User = {
    ...user,
    id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return newUser;
};

export const getUserByEmail = (email: string): User | undefined => {
  const users = getUsers();
  return users.find((u) => u.email === email);
};

export const getUserById = (id: string): User | undefined => {
  const users = getUsers();
  return users.find((u) => u.id === id);
};

export const updateCurrentUser = (updates: {
  name?: string;
  email?: string;
  password?: string;
}): User | null => {
  const currentUser = getCurrentUser();
  if (!currentUser) return null;

  const users = getUsers();
  const userIndex = users.findIndex((u) => u.id === currentUser.id);

  if (userIndex === -1) return null;

  // Update user data
  users[userIndex] = {
    ...users[userIndex],
    ...(updates.name && { name: updates.name }),
    ...(updates.email && { email: updates.email }),
    ...(updates.password && { password: updates.password }),
  };

  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  // Update current user session
  const updatedUser = users[userIndex];
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

  return updatedUser;
};

export const deleteUser = (id: string): boolean => {
  const users = getUsers();
  const filtered = users.filter((u) => u.id !== id);
  if (filtered.length === users.length) return false;
  localStorage.setItem(USERS_KEY, JSON.stringify(filtered));

  // If deleted user is current user, logout
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === id) {
    logout();
  }

  return true;
};

// Authentication
export const login = (email: string, password: string): User | null => {
  const user = getUserByEmail(email);
  if (user && user.password === password) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  }
  return null;
};

export const logout = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(CURRENT_USER_KEY);
  return data ? JSON.parse(data) : null;
};

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};

export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.role === "admin";
};

// Event management
export const getEvents = (): Event[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(EVENTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const getEventById = (id: string): Event | undefined => {
  const events = getEvents();
  return events.find((e) => e.id === id);
};

export const createEvent = (
  event: Omit<Event, "id" | "registeredUsers" | "createdAt">
): Event => {
  const events = getEvents();
  const user = getCurrentUser();
  const newEvent: Event = {
    ...event,
    id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    registeredUsers: [],
    createdBy: user?.id || "unknown",
    createdAt: new Date().toISOString(),
  };
  events.push(newEvent);
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  return newEvent;
};

export const updateEvent = (
  id: string,
  updates: Partial<Event>
): Event | null => {
  const events = getEvents();
  const index = events.findIndex((e) => e.id === id);
  if (index === -1) return null;
  events[index] = { ...events[index], ...updates };
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  return events[index];
};

export const deleteEvent = (id: string): boolean => {
  const events = getEvents();
  const filtered = events.filter((e) => e.id !== id);
  if (filtered.length === events.length) return false;
  localStorage.setItem(EVENTS_KEY, JSON.stringify(filtered));
  return true;
};

export const registerForEvent = (eventId: string, userId: string): boolean => {
  const event = getEventById(eventId);
  if (!event) return false;
  if (event.registeredUsers.includes(userId)) return false;
  if (event.registeredUsers.length >= event.capacity) return false;

  event.registeredUsers.push(userId);
  updateEvent(eventId, { registeredUsers: event.registeredUsers });
  return true;
};

export const unregisterFromEvent = (
  eventId: string,
  userId: string
): boolean => {
  const event = getEventById(eventId);
  if (!event) return false;
  event.registeredUsers = event.registeredUsers.filter((id) => id !== userId);
  updateEvent(eventId, { registeredUsers: event.registeredUsers });
  return true;
};

// Generate image URL based on event title/keywords
const generateEventImage = (title: string, category: string): string => {
  // Create a consistent seed based on title for consistent images
  const seed = title
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const categoryMap: Record<string, number> = {
    Technology: 1,
    Workshop: 2,
    Conference: 3,
    Seminar: 4,
    Networking: 5,
  };

  // Use Picsum Photos with consistent ID based on title and category
  const imageId = (seed % 1000) + (categoryMap[category] || 1) * 100;
  return `https://picsum.photos/seed/${imageId}/800/600`;
};

// Initialize default events
export const initializeDefaultEvents = () => {
  const events = getEvents();
  // Check if we need to add events (if less than expected count or empty)
  const EXPECTED_EVENT_COUNT = 38;
  if (events.length === 0 || events.length < EXPECTED_EVENT_COUNT) {
    const defaultEvents: Omit<
      Event,
      "id" | "registeredUsers" | "createdAt" | "createdBy"
    >[] = [
      {
        title: "AI Innovation Summit 2024",
        description:
          "Join us for a groundbreaking conference exploring the latest in AI technology, machine learning, and automation. Network with industry leaders and discover cutting-edge innovations.",
        date: "2024-06-15",
        time: "09:00",
        location: "San Francisco Convention Center",
        category: "Technology",
        image: generateEventImage("AI Innovation Summit 2024", "Technology"),
        organizer: "AI Tech Community",
        capacity: 500,
      },
      {
        title: "Machine Learning Workshop",
        description:
          "Hands-on workshop covering neural networks, deep learning, and practical ML applications. Perfect for developers and data scientists.",
        date: "2024-06-20",
        time: "14:00",
        location: "Tech Hub Downtown",
        category: "Workshop",
        image: generateEventImage("Machine Learning Workshop", "Workshop"),
        organizer: "ML Academy",
        capacity: 50,
      },
      {
        title: "Future of Automation",
        description:
          "Explore how automation is transforming industries. Panel discussions with experts and live demonstrations.",
        date: "2024-06-25",
        time: "10:00",
        location: "Digital Innovation Center",
        category: "Conference",
        image: generateEventImage("Future of Automation", "Conference"),
        organizer: "Automation Society",
        capacity: 300,
      },
      {
        title: "AI Ethics & Responsibility",
        description:
          "Important discussions on ethical AI development, bias mitigation, and responsible innovation in the age of AI.",
        date: "2024-07-01",
        time: "13:00",
        location: "University Auditorium",
        category: "Seminar",
        image: generateEventImage("AI Ethics & Responsibility", "Seminar"),
        organizer: "Ethics Institute",
        capacity: 200,
      },
      {
        title: "Startup AI Pitch Night",
        description:
          "Watch innovative AI startups pitch their ideas to investors. Networking and refreshments included.",
        date: "2024-07-05",
        time: "18:00",
        location: "Startup Incubator",
        category: "Networking",
        image: generateEventImage("Startup AI Pitch Night", "Networking"),
        organizer: "Venture Capitalists",
        capacity: 150,
      },
      {
        title: "Deep Learning Masterclass",
        description:
          "Advanced techniques in deep learning, CNNs, RNNs, and transformer architectures. Bring your laptop!",
        date: "2024-07-10",
        time: "09:30",
        location: "Tech University",
        category: "Workshop",
        image: generateEventImage("Deep Learning Masterclass", "Workshop"),
        organizer: "Deep Learning Lab",
        capacity: 75,
      },
      {
        title: "Neural Networks Explained",
        description:
          "Comprehensive introduction to neural networks, from basics to advanced concepts. Perfect for beginners and intermediate learners.",
        date: "2024-07-15",
        time: "11:00",
        location: "Online Event",
        category: "Workshop",
        image: generateEventImage("Neural Networks Explained", "Workshop"),
        organizer: "AI Learning Platform",
        capacity: 200,
      },
      {
        title: "Computer Vision Conference",
        description:
          "Explore the latest in computer vision, image recognition, and visual AI applications. Industry experts and research presentations.",
        date: "2024-07-20",
        time: "09:00",
        location: "Tech Convention Hall",
        category: "Conference",
        image: generateEventImage("Computer Vision Conference", "Conference"),
        organizer: "Vision AI Society",
        capacity: 400,
      },
      {
        title: "Natural Language Processing Bootcamp",
        description:
          "Intensive bootcamp on NLP, transformers, and language models. Hands-on coding sessions and real-world projects.",
        date: "2024-07-25",
        time: "10:00",
        location: "Coding Academy",
        category: "Workshop",
        image: generateEventImage(
          "Natural Language Processing Bootcamp",
          "Workshop"
        ),
        organizer: "NLP Experts",
        capacity: 60,
      },
      {
        title: "AI in Healthcare Symposium",
        description:
          "Discover how AI is revolutionizing healthcare: diagnostics, treatment plans, and patient care. Medical professionals welcome.",
        date: "2024-08-01",
        time: "14:00",
        location: "Medical Center",
        category: "Seminar",
        image: generateEventImage("AI in Healthcare Symposium", "Seminar"),
        organizer: "HealthTech Alliance",
        capacity: 250,
      },
      {
        title: "Robotics & AI Integration",
        description:
          "Learn about the intersection of robotics and AI. Live demonstrations of autonomous systems and intelligent machines.",
        date: "2024-08-05",
        time: "13:00",
        location: "Robotics Lab",
        category: "Technology",
        image: generateEventImage("Robotics & AI Integration", "Technology"),
        organizer: "Robotics Institute",
        capacity: 100,
      },
      {
        title: "AI for Business Leaders",
        description:
          "Strategic insights for executives on implementing AI in business. ROI, use cases, and transformation strategies.",
        date: "2024-08-10",
        time: "09:00",
        location: "Business Center",
        category: "Conference",
        image: generateEventImage("AI for Business Leaders", "Conference"),
        organizer: "Executive Forum",
        capacity: 300,
      },
      {
        title: "Reinforcement Learning Workshop",
        description:
          "Deep dive into RL algorithms, Q-learning, and policy gradients. Build your own RL agents in this hands-on session.",
        date: "2024-08-15",
        time: "10:00",
        location: "AI Research Lab",
        category: "Workshop",
        image: generateEventImage(
          "Reinforcement Learning Workshop",
          "Workshop"
        ),
        organizer: "RL Research Group",
        capacity: 40,
      },
      {
        title: "AI & Climate Change Solutions",
        description:
          "How AI can help solve climate challenges. Carbon tracking, energy optimization, and sustainable AI practices.",
        date: "2024-08-20",
        time: "15:00",
        location: "Environmental Center",
        category: "Seminar",
        image: generateEventImage("AI & Climate Change Solutions", "Seminar"),
        organizer: "GreenTech Initiative",
        capacity: 180,
      },
      {
        title: "AI Developer Meetup",
        description:
          "Monthly meetup for AI developers. Share projects, discuss challenges, and network with fellow developers.",
        date: "2024-08-25",
        time: "18:30",
        location: "Co-working Space",
        category: "Networking",
        image: generateEventImage("AI Developer Meetup", "Networking"),
        organizer: "Dev Community",
        capacity: 80,
      },
      {
        title: "GPT & Large Language Models",
        description:
          "Comprehensive overview of GPT models, fine-tuning techniques, and building LLM applications. Technical deep dive.",
        date: "2024-09-01",
        time: "11:00",
        location: "Tech University",
        category: "Workshop",
        image: generateEventImage("GPT & Large Language Models", "Workshop"),
        organizer: "LLM Research Lab",
        capacity: 120,
      },
      {
        title: "AI Security & Privacy Forum",
        description:
          "Critical discussions on AI security vulnerabilities, privacy concerns, and best practices for secure AI deployment.",
        date: "2024-09-05",
        time: "14:00",
        location: "Security Conference Center",
        category: "Seminar",
        image: generateEventImage("AI Security & Privacy Forum", "Seminar"),
        organizer: "CyberSec Alliance",
        capacity: 220,
      },
      {
        title: "Women in AI Summit",
        description:
          "Celebrating women leaders in AI. Keynote speakers, panel discussions, and networking opportunities.",
        date: "2024-09-10",
        time: "09:00",
        location: "Convention Center",
        category: "Conference",
        image: generateEventImage("Women in AI Summit", "Conference"),
        organizer: "Women in Tech",
        capacity: 500,
      },
      {
        title: "AI Startups Demo Day",
        description:
          "Watch 20 AI startups showcase their innovations. Investor pitches, product demos, and networking sessions.",
        date: "2024-09-15",
        time: "10:00",
        location: "Innovation Hub",
        category: "Networking",
        image: generateEventImage("AI Startups Demo Day", "Networking"),
        organizer: "Startup Accelerator",
        capacity: 300,
      },
      {
        title: "Edge AI & IoT Workshop",
        description:
          "Learn about deploying AI on edge devices and IoT systems. Real-world applications and optimization techniques.",
        date: "2024-09-20",
        time: "13:00",
        location: "IoT Innovation Lab",
        category: "Workshop",
        image: generateEventImage("Edge AI & IoT Workshop", "Workshop"),
        organizer: "IoT Research Center",
        capacity: 50,
      },
      {
        title: "AI in Finance & Trading",
        description:
          "Explore algorithmic trading, fraud detection, and financial AI applications. Industry experts share insights.",
        date: "2024-09-25",
        time: "10:00",
        location: "Financial District",
        category: "Conference",
        image: generateEventImage("AI in Finance & Trading", "Conference"),
        organizer: "FinTech Association",
        capacity: 350,
      },
      {
        title: "Generative AI Art & Design",
        description:
          "Creative applications of generative AI. Image generation, style transfer, and AI-assisted design workflows.",
        date: "2024-10-01",
        time: "15:00",
        location: "Art Gallery",
        category: "Workshop",
        image: generateEventImage("Generative AI Art & Design", "Workshop"),
        organizer: "Creative AI Collective",
        capacity: 90,
      },
      {
        title: "AI & Human Collaboration",
        description:
          "Exploring how humans and AI can work together effectively. Human-in-the-loop systems and augmentation.",
        date: "2024-10-05",
        time: "11:00",
        location: "Human-Computer Lab",
        category: "Seminar",
        image: generateEventImage("AI & Human Collaboration", "Seminar"),
        organizer: "HCI Research Group",
        capacity: 150,
      },
      {
        title: "Quantum Computing & AI",
        description:
          "The future of quantum machine learning. Quantum algorithms for AI and hybrid quantum-classical systems.",
        date: "2024-10-10",
        time: "14:00",
        location: "Quantum Research Facility",
        category: "Technology",
        image: generateEventImage("Quantum Computing & AI", "Technology"),
        organizer: "Quantum AI Labs",
        capacity: 120,
      },
      {
        title: "AI Career Development Day",
        description:
          "Career guidance for AI professionals. Resume reviews, interview tips, and networking with recruiters.",
        date: "2024-10-15",
        time: "12:00",
        location: "Career Center",
        category: "Networking",
        image: generateEventImage("AI Career Development Day", "Networking"),
        organizer: "Tech Careers",
        capacity: 200,
      },
      {
        title: "Autonomous Vehicles & AI",
        description:
          "Latest developments in self-driving technology. Sensor fusion, decision-making systems, and safety.",
        date: "2024-10-20",
        time: "09:00",
        location: "Automotive Research Center",
        category: "Technology",
        image: generateEventImage("Autonomous Vehicles & AI", "Technology"),
        organizer: "AutoTech Innovations",
        capacity: 280,
      },
      {
        title: "AI Open Source Summit",
        description:
          "Celebrating open source AI projects. Contribute, collaborate, and discover the best open source tools.",
        date: "2024-10-25",
        time: "10:00",
        location: "Developer Hub",
        category: "Conference",
        image: generateEventImage("AI Open Source Summit", "Conference"),
        organizer: "Open Source Foundation",
        capacity: 400,
      },
      {
        title: "AI in Education Conference",
        description:
          "How AI is transforming education. Personalized learning, intelligent tutoring, and educational technology.",
        date: "2024-11-01",
        time: "13:00",
        location: "Education Center",
        category: "Conference",
        image: generateEventImage("AI in Education Conference", "Conference"),
        organizer: "EdTech Alliance",
        capacity: 320,
      },
      {
        title: "AI Research Paper Review",
        description:
          "Critical review of latest AI research papers. Discussion sessions and author Q&A.",
        date: "2024-11-05",
        time: "15:00",
        location: "Research Institute",
        category: "Seminar",
        image: generateEventImage("AI Research Paper Review", "Seminar"),
        organizer: "AI Research Society",
        capacity: 100,
      },
      {
        title: "AI Hackathon 2024",
        description:
          "48-hour AI hackathon. Build innovative AI solutions, compete for prizes, and network with peers.",
        date: "2024-11-10",
        time: "09:00",
        location: "Hackathon Venue",
        category: "Workshop",
        image: generateEventImage("AI Hackathon 2024", "Workshop"),
        organizer: "Hackathon Organizers",
        capacity: 500,
      },
      {
        title: "AI & Blockchain Integration",
        description:
          "Explore the convergence of AI and blockchain technology. Smart contracts, decentralized AI, and tokenization.",
        date: "2024-11-15",
        time: "14:00",
        location: "Blockchain Innovation Hub",
        category: "Technology",
        image: generateEventImage("AI & Blockchain Integration", "Technology"),
        organizer: "Crypto AI Labs",
        capacity: 180,
      },
      {
        title: "Explainable AI Workshop",
        description:
          "Learn how to build transparent and interpretable AI systems. Model explainability techniques and best practices.",
        date: "2024-11-20",
        time: "10:00",
        location: "Research Center",
        category: "Workshop",
        image: generateEventImage("Explainable AI Workshop", "Workshop"),
        organizer: "XAI Research Group",
        capacity: 45,
      },
      {
        title: "AI in Agriculture Summit",
        description:
          "Revolutionizing farming with AI. Precision agriculture, crop monitoring, and sustainable food production.",
        date: "2024-11-25",
        time: "09:00",
        location: "Agricultural Innovation Center",
        category: "Conference",
        image: generateEventImage("AI in Agriculture Summit", "Conference"),
        organizer: "AgriTech Foundation",
        capacity: 250,
      },
      {
        title: "Federated Learning Masterclass",
        description:
          "Advanced techniques in federated learning for privacy-preserving AI. Distributed machine learning without data sharing.",
        date: "2024-12-01",
        time: "13:00",
        location: "Privacy Research Lab",
        category: "Workshop",
        image: generateEventImage("Federated Learning Masterclass", "Workshop"),
        organizer: "Privacy AI Institute",
        capacity: 60,
      },
      {
        title: "AI Music & Creative Arts",
        description:
          "Exploring AI-generated music, art, and creative content. Collaboration between AI and human artists.",
        date: "2024-12-05",
        time: "16:00",
        location: "Art & Technology Gallery",
        category: "Workshop",
        image: generateEventImage("AI Music & Creative Arts", "Workshop"),
        organizer: "Creative AI Collective",
        capacity: 120,
      },
      {
        title: "AI for Social Good Forum",
        description:
          "Using AI to address global challenges. Healthcare access, education, poverty reduction, and climate action.",
        date: "2024-12-10",
        time: "11:00",
        location: "Global Impact Center",
        category: "Seminar",
        image: generateEventImage("AI for Social Good Forum", "Seminar"),
        organizer: "Social Impact AI",
        capacity: 300,
      },
    ];

    const user = getUsers()[0] || { id: "admin-1" };

    // If events already exist, only add the missing ones
    if (events.length > 0) {
      const existingTitles = new Set(events.map((e) => e.title));
      const missingEvents = defaultEvents.filter(
        (e) => !existingTitles.has(e.title)
      );

      missingEvents.forEach((event) => {
        createEvent({
          ...event,
          createdBy: user.id,
        });
      });
    } else {
      // If no events exist, add all of them
      defaultEvents.forEach((event) => {
        createEvent({
          ...event,
          createdBy: user.id,
        });
      });
    }
  }
};

// Clear all events (useful for resetting)
export const clearAllEvents = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(EVENTS_KEY);
  }
};
