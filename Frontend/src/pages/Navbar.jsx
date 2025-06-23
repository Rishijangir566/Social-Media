import React, { useState } from "react";
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
} from "lucide-react";
import Logo from "../assets/LOGO.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(1);

  const navItems = [
    { icon: Home, label: "Home", active: true },
    { icon: Search, label: "Search", mobile: true },
    { icon: PlusSquare, label: "Create" },
    { icon: Heart, label: "Activity" },
    { icon: MessageCircle, label: "Messages" },
  ];

  return (
    <>
      <nav className=" border-b bg-indigo-300 border-gray-200 sticky top-0 z-50 backdrop-blur-md ">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/app/Home">
                <div className="w-15 h-10 md:w-12 md:h-12">
                  <img
                    src={Logo}
                    alt="Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              </Link>
            </div>

            <div className="hidden md:flex flex-1 max-w-xs mx-8">
              <div
                className={`relative w-full transition-all duration-300 ${
                  isSearchFocused ? "transform scale-105" : ""
                }`}
              >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search users, posts, hashtags..."
                  className={`w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    transition-all duration-300 ${
                      isSearchFocused
                        ? "bg-white shadow-lg"
                        : "hover:bg-gray-100"
                    }`}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              {navItems
                .filter((item) => !item.mobile)
                .map((item, index) => (
                  <button
                    key={index}
                    className={`p-2 rounded-full transition-all duration-200 hover:bg-gray-100 
                    ${
                      item.active
                        ? "text-blue-600"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                    title={item.label}
                  >
                    <item.icon className="h-6 w-6" />
                  </button>
                ))}

              <button
                className="relative p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
                onClick={() => navigate("/notifiction")}
              >
                <Bell className="h-6 w-6" />
                {notifications > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {notifications}
                  </div>
                )}
              </button>

              <button
                className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white hover:shadow-lg transition-all duration-200 hover:scale-105"
                onClick={() => navigate("/profile")}
              >
                <User className="h-4 w-4" />
              </button>
            </div>

            <button
              className="md:hidden p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          <div className="md:hidden pb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 animate-in slide-in-from-top duration-200">
            <div className="px-4 py-2 space-y-1">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200
                    ${
                      item.active
                        ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}

              <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200">
                <Bell className="h-5 w-5" />
                <span className="font-medium">Notifications</span>
                {notifications > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {notifications}
                  </span>
                )}
              </button>

              <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200">
                <User className="h-5 w-5" />
                <span className="font-medium">Profile</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around items-center py-2">
          {navItems
            .filter((item) => !item.mobile)
            .map((item, index) => (
              <button
                key={index}
                className={`p-3 rounded-full transition-all duration-200 ${
                  item.active
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <item.icon className="h-6 w-6" />
              </button>
            ))}

          <button className="relative p-3 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200">
            <Bell className="h-6 w-6" />
            {notifications > 0 && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {notifications > 9 ? "9+" : notifications}
              </div>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
