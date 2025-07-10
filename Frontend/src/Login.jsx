import { useState } from "react";
import { FaEnvelope, FaLock, FaEye } from "react-icons/fa";
import { BsFillEyeSlashFill } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { FaLinkedin } from "react-icons/fa6";
import { ImGithub } from "react-icons/im";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import instance from "./axiosConfig";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuth();

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    // Your original logic here
    try {
      console.log("Login submitted:", formData);
      const res = await instance.post("/user/login", formData);
      if (res.status === 201) {
        if (res.data?.user?.firstTimeSignIn === true) {
          setUser(true);
          navigate("/app/displayPosts");
        } else {
          setTimeout(() => {
            navigate("/profile");
            setUser(true);
          }, 1000);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleGitHubLogin() {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;

    const redirectUri = `${window.location.origin}/github-callback`;

    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=user`;
    window.location.href = githubAuthUrl;
  }

  function handleGoogleLogin() {
    console.log("first");
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = `${window.location.origin}/google/callback`;
    const scope =
      "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile";
    const responseType = "code";
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${encodeURIComponent(
      scope
    )}&access_type=offline`;
    window.location.href = authUrl;
  }

  const handleLinkedInLogin = () => {
    const clientId = import.meta.env.VITE_LINKEDIN_CLIENT_ID;
    const redirectUri =
      "https://social-media-1-mfvc.onrender.com/linkedin/callback";

    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=openid%20profile%20email`;

    window.location.href = authUrl;
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center px-4">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

        {/* Floating Orbs */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-10 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>

        {/* Animated Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Main Form Container */}
      <div className="relative w-full max-w-md transform transition-all duration-500 hover:scale-105">
        {/* Glassmorphism Card */}
        <div className="relative p-8 rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
          {/* Gradient Border Effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500 opacity-20 blur-sm"></div>

          {/* Inner Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-block p-3 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 mb-4">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"></div>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-cyan-200 mb-2">
                Access Your Dashboard
              </h2>
              <p className="text-white/60 text-sm">
                Sign in to access your account.
              </p>
            </div>

            {/* Social Login Buttons */}
            <div className="flex justify-center gap-4 mb-8">
              <button
                className="group relative p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                onClick={handleGoogleLogin}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <FcGoogle className="relative z-10 text-2xl" />
              </button>

              <button
                className="group relative p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                onClick={handleLinkedInLogin}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <FaLinkedin className="relative z-10 text-2xl text-blue-400" />
              </button>

              <button
                className="group relative p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                onClick={handleGitHubLogin}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-gray-500/20 to-gray-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <ImGithub className="relative z-10 text-2xl text-white" />
              </button>
            </div>

            {/* Divider */}
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-white/60">
                  or continue with email
                </span>
              </div>
            </div>

            {/* Login Form */}
            <div className="space-y-6">
              {/* Email Field */}
              <div className="group relative">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 group-focus-within:text-purple-300 transition-colors duration-300" />
                  <input
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent text-white placeholder-white/40 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="group relative">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 group-focus-within:text-purple-300 transition-colors duration-300" />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent text-white placeholder-white/40 transition-all duration-300"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white transition-colors duration-300"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEye /> : <BsFillEyeSlashFill />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="group relative w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center justify-center">
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </span>
              </button>
            </div>

            {/* Register Link */}
            <p className="text-center text-sm mt-8 text-white/60">
              Don't have an account?{" "}
              <Link to="/register">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 font-semibold cursor-pointer hover:from-purple-300 hover:to-cyan-300 transition-all duration-300">
                  Create Account
                </span>
              </Link>
            </p>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-20 blur-xl animate-pulse"></div>
        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full opacity-20 blur-xl animate-pulse animation-delay-2000"></div>
      </div>
    </div>
  );
}

export default Login;
