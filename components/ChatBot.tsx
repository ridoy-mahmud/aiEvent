"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Calendar, Search, HelpCircle } from "lucide-react";
import { useAppSelector } from "@/lib/store/hooks";
import { ButtonLoader } from "./Loader";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface SuggestedQuestion {
  id: string;
  text: string;
  icon?: React.ReactNode;
}

export default function ChatBot() {
  const { user } = useAppSelector((state) => state.auth);
  const { events } = useAppSelector((state) => state.events);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize messages on client-side only to prevent hydration errors
  useEffect(() => {
    setMounted(true);
    setMessages([
      {
        id: "1",
        text: "Hello! I'm your AI Events assistant. I can help you with registration, login, event information, categories, dates, and much more! How can I assist you today?",
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
  }, []);

  const suggestedQuestions: SuggestedQuestion[] = [
    { id: "1", text: "How do I register for events?", icon: <Calendar className="w-4 h-4" /> },
    { id: "2", text: "What events are available?", icon: <Search className="w-4 h-4" /> },
    { id: "3", text: "Tell me about upcoming events", icon: <Calendar className="w-4 h-4" /> },
    { id: "4", text: "What event categories do you have?", icon: <HelpCircle className="w-4 h-4" /> },
    { id: "5", text: "How do I create an account?", icon: <User className="w-4 h-4" /> },
    { id: "6", text: "What events are happening this month?", icon: <Calendar className="w-4 h-4" /> },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = async (userMessage: string): Promise<string> => {
    // Ensure userMessage is a string
    if (typeof userMessage !== 'string') {
      return "I'm sorry, I didn't understand that. Could you please try again?";
    }
    const message = userMessage.toLowerCase();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Account registration
    if (message.includes("register") || message.includes("sign up") || message.includes("create account") || message.includes("account")) {
      if (!message.includes("event")) {
        return `To create an account:\n1. Click 'Sign Up' in the navigation bar\n2. Fill in your name, email, and password\n3. Confirm your password\n4. Click 'Create Account'\n\nOnce registered, you can log in and register for events. Registration is completely free! ${user ? "\n\nNote: You're already logged in as " + user.name + "." : ""}`;
      }
    }

    // Login help
    if (message.includes("login") || message.includes("sign in") || message.includes("log in")) {
      return `To login:\n1. Click 'Login' in the navigation bar\n2. Enter your email and password\n3. Click 'Sign In'\n\n${user ? `✅ You're currently logged in as ${user.name} (${user.email}).` : "❌ You're not currently logged in. Please login to access all features."}\n\nDemo admin credentials:\nEmail: admin@aievents.com\nPassword: admin123`;
    }

    // Event count and overview
    if (message.includes("how many") && message.includes("event")) {
      const upcoming = events.filter(e => new Date(e.date) >= today);
      const categories = new Set(events.map(e => e.category));
      return `📊 Event Statistics:\n\n• Total Events: ${events.length}\n• Upcoming Events: ${upcoming.length}\n• Event Categories: ${categories.size} (${Array.from(categories).join(", ")})\n• Total Capacity: ${events.reduce((sum, e) => sum + e.capacity, 0).toLocaleString()} attendees\n\nBrowse all events on our homepage!`;
    }

    // Upcoming events
    if (message.includes("upcoming") || message.includes("coming soon") || message.includes("this month") || message.includes("next month")) {
      const upcoming = events.filter(e => new Date(e.date) >= today).sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      ).slice(0, 5);
      
      if (upcoming.length === 0) {
        return "No upcoming events found. Check back soon for new events!";
      }
      
      let response = `📅 Here are ${upcoming.length} upcoming events:\n\n`;
      upcoming.forEach((event: any, index) => {
        const date = new Date(event.date);
        response += `${index + 1}. ${event.title}\n   📍 ${event.location}\n   📆 ${date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} at ${event.time}\n   🏷️ ${event.category}\n\n`;
      });
      response += "Click on any event to see full details and register!";
      return response;
    }

    // Event categories
    if (message.includes("categor") || message.includes("type") || message.includes("kind")) {
      const categories = Array.from(new Set(events.map(e => e.category)));
      const categoryCounts = categories.map(cat => ({
        name: cat,
        count: events.filter(e => e.category === cat).length
      }));
      
      let response = `🏷️ We have ${categories.length} event categories:\n\n`;
      categoryCounts.forEach(cat => {
        response += `• ${cat.name}: ${cat.count} events\n`;
      });
      response += "\nYou can filter events by category on the homepage using the category buttons.";
      return response;
    }

    // Specific category queries
    const categories = ["technology", "workshop", "conference", "seminar", "networking"];
    for (const category of categories) {
      if (message.includes(category)) {
        const categoryEvents = events.filter(e => 
          e.category.toLowerCase() === category || 
          e.title.toLowerCase().includes(category) ||
          e.description.toLowerCase().includes(category)
        );
        
        if (categoryEvents.length === 0) {
          return `No ${category} events found. Try browsing other categories!`;
        }
        
        const upcomingCategory = categoryEvents.filter(e => new Date(e.date) >= today).slice(0, 3);
        let response = `Found ${categoryEvents.length} ${category} event${categoryEvents.length > 1 ? "s" : ""}!\n\n`;
        if (upcomingCategory.length > 0) {
          response += "Upcoming events:\n";
          upcomingCategory.forEach((event, index) => {
            response += `${index + 1}. ${event.title} - ${new Date(event.date).toLocaleDateString()}\n`;
          });
        }
        response += `\nBrowse all ${category} events on the homepage!`;
        return response;
      }
    }

    // Event registration process
    if (message.includes("register for event") || message.includes("join event") || message.includes("book event") || message.includes("sign up for event")) {
      if (!user) {
        return "❌ To register for an event, you need to be logged in.\n\nSteps:\n1. Click 'Login' or 'Sign Up' in the navigation\n2. Once logged in, browse events\n3. Click 'Register' on any event card\n\nRegistration is free and takes just seconds!";
      }
      const userEvents = events.filter(e => e.registeredUsers.includes(user.id));
      return `✅ To register for an event:\n\n1. Browse events on the homepage\n2. Click on an event card or 'View Details'\n3. Click the 'Register' button\n4. Confirm your registration\n\nYou can also register directly from event cards!\n\n${userEvents.length > 0 ? `📋 You're currently registered for ${userEvents.length} event${userEvents.length > 1 ? "s" : ""}.` : ""}`;
    }

    // Location-based queries
    if (message.includes("location") || message.includes("where") || message.includes("place") || message.includes("venue")) {
      const locations = Array.from(new Set(events.map(e => e.location)));
      const locationCounts = locations.slice(0, 5).map(loc => ({
        name: loc,
        count: events.filter(e => e.location === loc).length
      }));
      
      let response = `📍 Event Locations:\n\n`;
      locationCounts.forEach(loc => {
        response += `• ${loc.name}: ${loc.count} event${loc.count > 1 ? "s" : ""}\n`;
      });
      response += `\nWe have events in ${locations.length} different locations. Filter events by location on the homepage!`;
      return response;
    }

    // Date queries
    if (message.includes("date") || message.includes("when") || message.includes("schedule")) {
      const nextMonth = new Date(today);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      const thisMonthEvents = events.filter(e => {
        const eventDate = new Date(e.date);
        return eventDate >= today && eventDate < nextMonth;
      });
      
      return `📆 Event Schedule:\n\n• Events this month: ${thisMonthEvents.length}\n• Total upcoming events: ${events.filter(e => new Date(e.date) >= today).length}\n\nEvents are scheduled throughout the year. Browse the homepage to see all upcoming dates and times!`;
    }

    // Event details/search
    if (message.includes("find") || message.includes("search") || message.includes("looking for")) {
      return `🔍 To find events:\n\n• Use the search bar on the homepage\n• Filter by category (Technology, Workshop, Conference, etc.)\n• Browse through paginated event cards\n• Click on any event for full details\n\nWe have ${events.length} events covering various AI topics!`;
    }

    // Help and capabilities
    if (message.includes("help") || message.includes("what can you do") || message.includes("capabilities") || message.includes("features")) {
      return `🤖 I can help you with:\n\n✅ Account & Registration\n• Create account\n• Login/Logout\n• Profile information\n\n✅ Events\n• Browse events\n• Event categories\n• Upcoming events\n• Event locations & dates\n• Register for events\n\n✅ Information\n• Platform features\n• Event details\n• Registration process\n\nJust ask me anything! Try "upcoming events" or "event categories".`;
    }

    // Admin features
    if (message.includes("admin") || message.includes("dashboard")) {
      if (user?.role === "admin") {
        return `👨‍💼 Admin Features:\n\n• Access Admin Dashboard\n• Create new events\n• Edit existing events\n• Delete events\n• View statistics\n• Manage registrations\n\nVisit /admin to access the dashboard!`;
      }
      return "Admin features are only available to administrators. Contact support if you need admin access.";
    }

    // Greetings
    if (message.includes("hello") || message.includes("hi") || message.includes("hey") || message.includes("greeting")) {
      return `👋 Hello! ${user ? `Welcome back, ${user.name}! ` : ""}\n\nI'm your AI Events assistant. I can help you with:\n• Event browsing and registration\n• Account management\n• Event information\n• Platform features\n\nWhat would you like to know? Try asking about "upcoming events" or "event categories"!`;
    }

    // User status and profile
    if (message.includes("who am i") || message.includes("my account") || message.includes("my profile") || message.includes("status")) {
      if (user) {
        const userEvents = events.filter(e => e.registeredUsers.includes(user.id));
        return `👤 Your Account:\n\n• Name: ${user.name}\n• Email: ${user.email}\n• Role: ${user.role}\n• Registered Events: ${userEvents.length}\n\n${userEvents.length > 0 ? `You're registered for:\n${userEvents.slice(0, 3).map(e => `• ${e.title}`).join("\n")}${userEvents.length > 3 ? `\n...and ${userEvents.length - 3} more` : ""}` : "Browse events to register!"}`;
      }
      return "❌ You're not currently logged in.\n\nTo access your account:\n1. Click 'Login' if you have an account\n2. Click 'Sign Up' to create a new account\n\nCreating an account is free and only takes a minute!";
    }

    // Pricing/Cost
    if (message.includes("price") || message.includes("cost") || message.includes("free") || message.includes("paid")) {
      return "💰 Pricing:\n\n✅ Free Features:\n• Browse all events\n• Create account\n• Register for events\n• View event details\n• Use search & filters\n\nAll events on our platform are free to browse and register. No hidden fees!";
    }

    // Contact information
    if (message.includes("contact") || message.includes("support") || message.includes("email") || message.includes("help desk")) {
      return `📧 Contact Information:\n\n• Email: contact@aievents.com\n• Support: support@aievents.com\n• Response Time: Within 24 hours\n\nVisit the Contact page (/contact) to send us a message!`;
    }

    // FAQ-style responses
    if (message.includes("faq") || message.includes("question") || message.includes("common")) {
      return `❓ Common Questions:\n\nQ: How do I register for an event?\nA: Create an account, browse events, and click 'Register'!\n\nQ: Are events free?\nA: Yes, browsing and registration are completely free!\n\nQ: Can I cancel my registration?\nA: Yes, you can unregister from events anytime.\n\nQ: How many events do you have?\nA: We currently have ${events.length} amazing AI events!\n\nAsk me anything else!`;
    }

    // Default response with suggestions
    const suggestions = [
      "Try asking about 'upcoming events'",
      "Ask about 'event categories'",
      "Say 'how do I register' for registration help",
      "Try 'event locations' to see where events are held",
    ];
    return `I'm here to help! 💬\n\nI can assist with:\n• Event browsing and information\n• Account registration and login\n• Event categories and dates\n• Registration process\n\n${suggestions[Math.floor(Math.random() * suggestions.length)]}\n\nOr ask me anything else!`;
  };

  const handleSend = async (messageText?: string) => {
    // Ensure we're working with a string, not an event object
    const textToSend = typeof messageText === 'string' ? messageText : input.trim();
    if (!textToSend || loading) return;
    
    // Additional validation - ensure it's actually a string
    if (typeof textToSend !== 'string') {
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: "user",
      timestamp: new Date(),
    };

    // Prepare conversation history BEFORE adding new message
    const conversationHistory = messages.slice(-10).map(msg => ({
      sender: msg.sender,
      text: msg.text
    }));

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setShowSuggestions(false);
    setLoading(true);

    try {

      // Call OpenAI API via our API route
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: textToSend,
          conversationHistory: conversationHistory,
          userInfo: user ? {
            name: user.name,
            email: user.email,
            role: user.role
          } : null,
          eventsInfo: events.length > 0 ? events.map(e => ({
            title: e.title,
            category: e.category,
            date: e.date,
            location: e.location,
            description: e.description
          })) : [],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Chat API error:', errorData);
        // Fallback to local response if API fails
        const botResponse = await generateResponse(textToSend);
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: botResponse,
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
        setLoading(false);
        return;
      }

      const data = await response.json();
      
      // Check if there's an error in the response
      if (data.error) {
        console.error('Chat API error:', data.error);
        // Fallback to local response
        const botResponse = await generateResponse(textToSend);
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: botResponse,
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
        setLoading(false);
        return;
      }

      const botResponse = data.message || await generateResponse(textToSend);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      // Fallback to local response if API fails
      const botResponse = await generateResponse(textToSend);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (question: string) => {
    handleSend(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Don't render until mounted to prevent hydration errors
  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-primary hover:bg-primary/90 text-black p-4 rounded-full shadow-lg z-50 transition-all hover:scale-110"
          aria-label="Open chat"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-dark-100 border border-dark-200 rounded-lg shadow-2xl z-50 flex flex-col" style={{ backgroundColor: 'rgba(13, 22, 26, 1)', backdropFilter: 'none' }}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-dark-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex-center">
                <Bot className="w-5 h-5 text-black" />
              </div>
              <div>
                <h3 className="font-semibold">AI Assistant</h3>
                <p className="text-xs text-light-200">Online</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-light-200 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Suggested Questions */}
            {showSuggestions && messages.length === 1 && (
              <div className="space-y-2 mb-4">
                <p className="text-xs text-light-200 mb-2">💡 Suggested questions:</p>
                <div className="grid grid-cols-1 gap-2">
                  {suggestedQuestions.map((question) => (
                    <button
                      key={question.id}
                      onClick={() => handleSuggestionClick(question.text)}
                      className="text-left bg-dark-200 hover:bg-dark-100 border border-dark-200 hover:border-primary/50 rounded-lg px-3 py-2 text-sm text-light-100 transition-colors flex items-center gap-2"
                    >
                      {question.icon}
                      <span>{question.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.sender === "bot" && (
                  <div className="w-8 h-8 bg-primary rounded-full flex-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-black" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-lg px-4 py-2 ${
                    message.sender === "user"
                      ? "bg-primary text-black"
                      : "bg-dark-200 text-light-100"
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                {message.sender === "user" && (
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex-center flex-shrink-0">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-primary rounded-full flex-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-black" />
                </div>
                <div className="bg-dark-200 rounded-lg px-4 py-2">
                  <ButtonLoader />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-dark-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 bg-dark-200 border border-dark-200 rounded-lg px-4 py-2 text-white placeholder-light-200 focus:outline-none focus:border-primary transition-colors"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className="bg-primary hover:bg-primary/90 text-black p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-light-200">
                Ask about events, registration, or categories
              </p>
              {messages.length > 1 && (
                <button
                  onClick={() => {
                    setMessages([{
                      id: "1",
                      text: "Hello! I'm your AI Events assistant. I can help you with registration, login, event information, categories, dates, and much more! How can I assist you today?",
                      sender: "bot",
                      timestamp: new Date(),
                    }]);
                    setShowSuggestions(true);
                  }}
                  className="text-xs text-primary hover:underline"
                >
                  Reset chat
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

