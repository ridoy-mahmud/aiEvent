"use client";

import AuthGuard from "@/components/AuthGuard";
import { Calendar, Users, Target, Award, Zap, Globe } from "lucide-react";

export default function AboutPage() {
  return (
    <AuthGuard>
      <div className="py-10 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl mb-4">About AI Events</h1>
        <p className="text-light-200 text-lg max-w-2xl mx-auto">
          Your premier destination for discovering and joining cutting-edge AI conferences, 
          workshops, and networking events worldwide.
        </p>
      </div>

      <div className="glass p-8 rounded-lg card-shadow mb-8">
        <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
        <p className="text-light-100 text-lg leading-relaxed mb-4">
          At AI Events, we believe in democratizing access to the best AI knowledge and networking 
          opportunities. Our platform connects passionate AI enthusiasts, professionals, researchers, 
          and innovators with transformative events that shape the future of technology.
        </p>
        <p className="text-light-200 leading-relaxed">
          Whether you're a beginner exploring machine learning or an industry veteran working on 
          cutting-edge AI solutions, we help you find events that match your interests and advance 
          your career in artificial intelligence.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="glass p-6 rounded-lg card-shadow text-center">
          <Calendar className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">32+ Events</h3>
          <p className="text-light-200">Curated AI events from around the world</p>
        </div>
        <div className="glass p-6 rounded-lg card-shadow text-center">
          <Users className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">5000+ Attendees</h3>
          <p className="text-light-200">Active community of AI professionals</p>
        </div>
        <div className="glass p-6 rounded-lg card-shadow text-center">
          <Target className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">100% Free</h3>
          <p className="text-light-200">Browse and register for events at no cost</p>
        </div>
      </div>

      <div className="glass p-8 rounded-lg card-shadow mb-8">
        <h2 className="text-2xl font-bold mb-6">What We Offer</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <Zap className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Diverse Event Categories</h3>
              <p className="text-light-200">
                From technical workshops to high-level conferences, we cover all aspects of AI 
                including machine learning, deep learning, NLP, computer vision, and more.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <Globe className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Global Reach</h3>
              <p className="text-light-200">
                Events from major tech hubs worldwide, including online options for remote 
                participation.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <Award className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Expert Curated</h3>
              <p className="text-light-200">
                Each event is carefully selected to ensure quality content and valuable 
                learning experiences.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Community Driven</h3>
              <p className="text-light-200">
                Built by the AI community, for the AI community. Share, learn, and grow together.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass p-8 rounded-lg card-shadow">
        <h2 className="text-2xl font-bold mb-4">Join Our Community</h2>
        <p className="text-light-100 text-lg mb-6">
          Ready to take your AI journey to the next level? Browse our curated events, register for 
          sessions that interest you, and connect with like-minded professionals. Whether you're 
          looking to learn new skills, network with industry leaders, or discover the latest AI 
          innovations, AI Events is your gateway.
        </p>
        <div className="flex gap-4">
          <a
            href="/"
            className="bg-primary hover:bg-primary/90 text-black font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Browse Events
          </a>
          <a
            href="/register"
            className="bg-dark-200 hover:bg-dark-100 text-light-100 font-semibold px-6 py-3 rounded-lg transition-colors border border-dark-200"
          >
            Create Account
          </a>
        </div>
      </div>
    </div>
    </AuthGuard>
  );
}

