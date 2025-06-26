import { useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../axiosConfig.js";
import { LuLogOut } from "react-icons/lu";
import { Link } from "react-router-dom";

import {
  Search,
  Bell,
  MessageCircle,
  User,
  Home,
  Heart,
  PlusSquare,
  Menu,
  X,
  Sparkles,
  LogOut,
} from "lucide-react";

const Navbar = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await instance.get("/api/users/logout");

      if (res.status == 200) {
        navigate("/");
      } else {
        alert("Failed to log out.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout failed");
    }
  };

  return (
    <>
      {/* Glassmorphism Navbar */}
      <nav className="border-b border-white/10 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-opacity-80 shadow-2xl">
        {/* Animated background dots */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -left-4 w-8 h-8 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute top-8 left-1/4 w-3 h-3 bg-white/20 rounded-full animate-bounce delay-100"></div>
          <div className="absolute top-4 right-1/3 w-2 h-2 bg-white/15 rounded-full animate-ping delay-300"></div>
          <div className="absolute -bottom-2 right-1/4 w-6 h-6 bg-white/10 rounded-full animate-pulse delay-500"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 relative">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300 hover:scale-105 transform">
                <Sparkles className="w-6 h-6 text-white animate-pulse" />
              </div>
              <span className="hidden md:block text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                SocialHub
              </span>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div
                className={`relative w-full transition-all duration-500 ${
                  isSearchFocused ? "transform scale-105" : ""
                }`}
              >
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search
                    className={`h-5 w-5 transition-colors duration-300 ${
                      isSearchFocused ? "text-purple-500" : "text-gray-400"
                    }`}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Search users, posts, hashtags..."
                  className={`w-full pl-12 pr-6 py-3 bg-white/10 backdrop-blur-md text-white placeholder-white/70 border border-white/20 rounded-2xl 
                    focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40
                    transition-all duration-300 ${
                      isSearchFocused
                        ? "bg-white/20 shadow-2xl"
                        : "hover:bg-white/15"
                    }`}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                {isSearchFocused && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500/20 to-violet-500/20 -z-10 blur animate-pulse"></div>
                )}
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {/* Home */}
              <button
                className={`relative p-3 rounded-xl transition-all duration-300 group ${
                  activeTab === "Home"
                    ? "bg-white/20 text-white shadow-lg"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
                title="Home"
                onClick={() => navigate("/app/Home")}
              >
                <Home className="h-6 w-6" />
                {activeTab === "Home" && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/30 to-violet-500/30 -z-10 animate-pulse"></div>
                )}
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              {/* Create */}
             <Link  to="/app/post">
              <button
                className={`relative p-3 rounded-xl transition-all duration-300 group ${
                  activeTab === "Create"
                    ? "bg-white/20 text-white shadow-lg"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
                title="Create"
                onClick={() => setActiveTab("Create")}
              >
                <PlusSquare className="h-6 w-6" />
                {activeTab === "Create" && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/30 to-violet-500/30 -z-10 animate-pulse"></div>
                )}
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button></Link>

              {/* Activity */}
             <Link to="/app/notification">
              <button
                className={`relative p-3 rounded-xl transition-all duration-300 group ${
                  activeTab === "Activity"
                    ? "bg-white/20 text-white shadow-lg"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
                title="Activity"
                onClick={() => setActiveTab("Activity")}
              >
                <Heart className="h-6 w-6" />
                {activeTab === "Activity" && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/30 to-violet-500/30 -z-10 animate-pulse"></div>
                )}
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button></Link>

              {/* Messages */}
           <Link to="/app/message">
              <button
                className={`relative p-3 rounded-xl transition-all duration-300 group ${
                  activeTab === "Messages"
                    ? "bg-white/20 text-white shadow-lg"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
                title="Messages"
                onClick={() => setActiveTab("Messages")}
              >
                <MessageCircle className="h-6 w-6" />
                {activeTab === "Messages" && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/30 to-violet-500/30 -z-10 animate-pulse"></div>
                )}
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button></Link>

              {/* Profile */}
              <button
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center text-white hover:shadow-xl transition-all duration-300 hover:scale-110 transform shadow-lg"
                onClick={() => navigate("/app/profile")}
              >
                <User className="h-5 w-5" />
              </button>

              <button
                className="relative p-3 rounded-xl text-white/80 ml-4 hover:text-white hover:bg-red-500/20 transition-all duration-300 group border border-white/20 hover:border-red-500/40"
                title="Logout"
                onClick={handleLogout}
              >
                <LuLogOut className="h-6 w-6" />
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1  bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                       
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-white/70" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-md text-white placeholder-white/70 border border-white/20 rounded-2xl 
                  focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300"
              />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 backdrop-blur-md bg-black/20 animate-in slide-in-from-top duration-300">
            <div className="px-4 py-4 space-y-2">
              {/* Home */}
              <button
                className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl text-left transition-all duration-300 ${
                  activeTab === "Home"
                    ? "bg-white/20 text-white shadow-lg"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
                onClick={() => setActiveTab("Home")}
              >
                <Home className="h-5 w-5" />
                <span className="font-medium">Home</span>
              </button>

              {/* Search */}
              <button
                className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl text-left transition-all duration-300 ${
                  activeTab === "Search"
                    ? "bg-white/20 text-white shadow-lg"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
                onClick={() => setActiveTab("Search")}
              >
                <Search className="h-5 w-5" />
                <span className="font-medium">Search</span>
              </button>

              {/* Create */}
              <button
                className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl text-left transition-all duration-300 ${
                  activeTab === "Create"
                    ? "bg-white/20 text-white shadow-lg"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
                onClick={() => setActiveTab("Create")}
              >
                <PlusSquare className="h-5 w-5" />
                <span className="font-medium">Create</span>
              </button>

              {/* Activity */}
              <button
                className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl text-left transition-all duration-300 ${
                  activeTab === "Activity"
                    ? "bg-white/20 text-white shadow-lg"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
                onClick={() => setActiveTab("Activity")}
              >
                <Heart className="h-5 w-5" />
                <span className="font-medium">Activity</span>
              </button>

              {/* Messages */}
              <button
                className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl text-left transition-all duration-300 ${
                  activeTab === "Messages"
                    ? "bg-white/20 text-white shadow-lg"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
                onClick={() => setActiveTab("Messages")}
              >
                <MessageCircle className="h-5 w-5" />
                <span className="font-medium">Messages</span>
              </button>

              {/* Profile */}
              <button className="w-full flex items-center space-x-4 px-4 py-3 rounded-xl text-left text-white/80 hover:bg-white/10 hover:text-white transition-all duration-300">
                <User className="h-5 w-5" />
                <span className="font-medium">Profile</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-violet-600/95 via-purple-600/95 to-indigo-600/95 backdrop-blur-xl border-t border-white/10 z-50 shadow-2xl">
        <div className="flex justify-around items-center py-3">
          {/* Home */}
          <button
            className={`relative p-3 rounded-xl transition-all duration-300 ${
              activeTab === "Home"
                ? "text-white bg-white/20 shadow-lg"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
            onClick={() => setActiveTab("Home")}
          >
            <Home className="h-6 w-6" />
            {activeTab === "Home" && (
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-pink-400 to-violet-400 rounded-full"></div>
            )}
          </button>

          {/* Create */}
          <button
            className={`relative p-3 rounded-xl transition-all duration-300 ${
              activeTab === "Create"
                ? "text-white bg-white/20 shadow-lg"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
            onClick={() => setActiveTab("Create")}
          >
            <PlusSquare className="h-6 w-6" />
            {activeTab === "Create" && (
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-pink-400 to-violet-400 rounded-full"></div>
            )}
          </button>

          {/* Activity */}
          <button
            className={`relative p-3 rounded-xl transition-all duration-300 ${
              activeTab === "Activity"
                ? "text-white bg-white/20 shadow-lg"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
            onClick={() => setActiveTab("Activity")}
          >
            <Heart className="h-6 w-6" />
            {activeTab === "Activity" && (
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-pink-400 to-violet-400 rounded-full"></div>
            )}
          </button>

          {/* Messages */}
          <button
            className={`relative p-3 rounded-xl transition-all duration-300 ${
              activeTab === "Messages"
                ? "text-white bg-white/20 shadow-lg"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
            onClick={() => setActiveTab("Messages")}
          >
            <MessageCircle className="h-6 w-6" />
            {activeTab === "Messages" && (
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-pink-400 to-violet-400 rounded-full"></div>
            )}
          </button>

          <button
            className="relative p-3 rounded-xl text-white/80 hover:text-white hover:bg-red-500/20 transition-all duration-300 group border border-white/20 hover:border-red-500/40"
            title="Logout"
            onClick={handleLogout}
          >
            <LuLogOut className="h-6 w-6" />
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
