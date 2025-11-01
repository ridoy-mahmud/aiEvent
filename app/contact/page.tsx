"use client";

import { useState } from "react";
import { Mail, MessageSquare, Send, CheckCircle, Loader as LoaderIcon } from "lucide-react";
import { ButtonLoader } from "@/components/Loader";
import AuthGuard from "@/components/AuthGuard";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Store in localStorage for demo
    const contacts = JSON.parse(localStorage.getItem("ai_event_contacts") || "[]");
    contacts.push({
      ...formData,
      id: Date.now(),
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem("ai_event_contacts", JSON.stringify(contacts));

    setLoading(false);
    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });

    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <AuthGuard>
      <div className="py-10 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl mb-4">Get In Touch</h1>
        <p className="text-light-200 text-lg">
          Have questions? Want to submit an event? We'd love to hear from you!
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="glass p-6 rounded-lg card-shadow">
            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-light-200">contact@aievents.com</p>
                  <p className="text-light-200">support@aievents.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MessageSquare className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Response Time</h3>
                  <p className="text-light-200">We typically respond within 24 hours</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-lg card-shadow">
            <h3 className="text-xl font-bold mb-4">Why Contact Us?</h3>
            <div className="space-y-2 text-light-200">
              <p>Submit your AI event to our platform</p>
              <p>Report issues or bugs</p>
              <p>Partner with us</p>
              <p>General inquiries</p>
              <p>Feedback and suggestions</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="glass p-8 rounded-lg card-shadow">
          {submitted && (
            <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>Message sent successfully! We'll get back to you soon.</span>
            </div>
          )}

          <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-light-100 mb-2">
                Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-dark-200 border border-dark-200 rounded-lg px-4 py-3 text-white placeholder-light-200 focus:outline-none focus:border-primary transition-colors"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-light-100 mb-2">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-dark-200 border border-dark-200 rounded-lg px-4 py-3 text-white placeholder-light-200 focus:outline-none focus:border-primary transition-colors"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-light-100 mb-2">
                Subject *
              </label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full bg-dark-200 border border-dark-200 rounded-lg px-4 py-3 text-white placeholder-light-200 focus:outline-none focus:border-primary transition-colors"
                placeholder="What's this about?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-light-100 mb-2">
                Message *
              </label>
              <textarea
                required
                rows={6}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-dark-200 border border-dark-200 rounded-lg px-4 py-3 text-white placeholder-light-200 focus:outline-none focus:border-primary transition-colors resize-none"
                placeholder="Tell us more about your inquiry..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-black font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <ButtonLoader />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
    </AuthGuard>
  );
}

