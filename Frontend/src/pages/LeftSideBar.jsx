import { Link, useLocation } from "react-router-dom";
import { Users, Heart, PlusSquare, User, Network } from "lucide-react";
import { GoFileMedia } from "react-icons/go";

const LeftSideBar = () => {
  const location = useLocation();

  return (
    <div className="w-[100%] h-screen bg-gradient-to-br from-blue-900 via-blue-900 to-indigo-900 hidden md:block text-white p-6 shadow-2xl sticky top-0 z-50 backdrop-blur-xl bg-opacity-80  overflow-hidden">
      {/* Animated background dots */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-8 h-8 bg-white/10 rounded-full animate-pulse"></div>
        <div
          className="absolute top-8 left-1/4 w-3 h-3 bg-white/20 rounded-full animate-bounce delay-100"
          style={{ animationDelay: "100ms" }}
        ></div>
        <div
          className="absolute top-4 right-1/3 w-2 h-2 bg-white/15 rounded-full animate-ping delay-300"
          style={{ animationDelay: "300ms" }}
        ></div>
        <div
          className="absolute -bottom-2 right-1/4 w-6 h-6 bg-white/10 rounded-full animate-pulse delay-500"
          style={{ animationDelay: "500ms" }}
        ></div>
        <div
          className="absolute bottom-20 left-10 w-4 h-4 bg-white/15 rounded-full animate-bounce delay-700"
          style={{ animationDelay: "700ms" }}
        ></div>
        <div
          className="absolute top-1/2 right-8 w-5 h-5 bg-white/10 rounded-full animate-ping delay-1000"
          style={{ animationDelay: "1000ms" }}
        ></div>
      </div>

      <div className="relative z-10">
        <h2 className="text-3xl font-bold mb-10 text-center border-b border-white/10 pb-4 tracking-wide bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
          Menu
        </h2>

        <nav className="flex flex-col gap-5 text-lg font-medium">
          <Link
            to="/app/network"
            className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
              location.pathname === "/app/network"
                ? "bg-white/20 text-white font-semibold shadow-lg"
                : "text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-md"
            }`}
          >
            {location.pathname === "/app/network" && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/30 to-violet-500/30 -z-10 animate-pulse"></div>
            )}
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Network
              size={20}
              className="group-hover:rotate-12 transition-transform duration-300"
            />
            <span>My Network</span>
          </Link>

          <Link
            to="/app/post"
            className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
              location.pathname === "/app/post"
                ? "bg-white/20 text-white font-semibold shadow-lg"
                : "text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-md"
            }`}
          >
            {location.pathname === "/app/post" && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/30 to-violet-500/30 -z-10 animate-pulse"></div>
            )}
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <PlusSquare
              className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300"
              size={20}
            />

            <span>Post</span>
          </Link>
          <Link
            to="/app/displayPosts"
            className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
              location.pathname === "/app/setting"
                ? "bg-white/20 text-white font-semibold shadow-lg"
                : "text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-md"
            }`}
          >
            {location.pathname === "/app/setting" && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/30 to-violet-500/30 -z-10 animate-pulse"></div>
            )}
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <GoFileMedia
              size={20}
              className="group-hover:rotate-12 transition-transform duration-300"
            />
            <span>Feed</span>
          </Link>

          <Link
            to="/app/Home"
            className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
              location.pathname === "/app/connection"
                ? "bg-white/20 text-white font-semibold shadow-lg"
                : "text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-md"
            }`}
          >
            {location.pathname === "/app/connection" && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/30 to-violet-500/30 -z-10 animate-pulse"></div>
            )}
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Users
              size={20}
              className="group-hover:rotate-12 transition-transform duration-300"
            />
            <span>Connection</span>
          </Link>

          <Link
            to="/app/notification"
            className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
              location.pathname === "/app/notification"
                ? "bg-white/20 text-white font-semibold shadow-lg"
                : "text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-md"
            }`}
          >
            {location.pathname === "/app/notification" && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/30 to-violet-500/30 -z-10 animate-pulse"></div>
            )}
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Heart className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
            <span>Notification</span>
          </Link>

          <Link
            to="/app/profile"
            className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
              location.pathname === "/app/profile"
                ? "bg-white/20 text-white font-semibold shadow-lg"
                : "text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-md"
            }`}
          >
            {location.pathname === "/app/profile" && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/30 to-violet-500/30 -z-10 animate-pulse"></div>
            )}
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <User
              size={20}
              className="group-hover:rotate-12 transition-transform duration-300"
            />
            <span>Profile</span>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default LeftSideBar;
