import React, { useState } from "react";
import {
  BookOpen,
  Search,
  BarChart3,
  Shield,
  Smartphone,
  Zap,
} from "lucide-react";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";

const LandingPage = () => {
  const [showLogin, setShowLogin] = useState(true);

  const features = [
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Track Your Reading",
      description:
        "Keep track of all your books, manga, and web novels in one place.",
    },
    {
      icon: <Search className="h-8 w-8" />,
      title: "Smart Search",
      description:
        "Find your books quickly with powerful search and filtering options.",
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Reading Progress",
      description:
        "Monitor your reading progress with detailed statistics and insights.",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure & Private",
      description:
        "Your reading data is private and secure with JWT authentication.",
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "Mobile Friendly",
      description: "Access your reading dashboard from any device, anywhere.",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Lightning Fast",
      description: "Built with modern technologies for the best performance.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-primary-600 mr-3" />
              <span className="text-xl font-bold text-gray-900">
                Reading Dashboard
              </span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowLogin(true)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  showLogin
                    ? "bg-primary-600 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setShowLogin(false)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  !showLogin
                    ? "bg-primary-600 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Hero content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Your Personal
                <span className="text-primary-600 block">
                  Reading Dashboard
                </span>
              </h1>
              <p className="mt-6 text-xl text-gray-600 leading-relaxed">
                Track your reading progress, discover new books, and never lose
                your place again. Perfect for books, manga, and web novels.
              </p>
            </div>

            {/* Features grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 text-primary-600">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="btn-primary text-lg px-8 py-3">
                Get Started Free
              </button>
              <button className="btn-secondary text-lg px-8 py-3">
                Learn More
              </button>
            </div>
          </div>

          {/* Right side - Auth forms */}
          <div className="lg:pl-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {showLogin ? (
                <LoginForm onSwitchToSignup={() => setShowLogin(false)} />
              ) : (
                <SignupForm onSwitchToLogin={() => setShowLogin(true)} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 Reading Dashboard. Built with ❤️ for book lovers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
