import { useState } from "react";
import bgImage from "./assets/RegisterForm.png";
import { FaEnvelope, FaLock, FaEye } from "react-icons/fa";
import { BsFillEyeSlashFill } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { FaLinkedin } from "react-icons/fa6";
import { ImGithub } from "react-icons/im";
import { Link, useNavigate } from "react-router-dom";
import instance from "./axiosConfig";
import { useAuth } from "./context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { setUser } = useAuth();

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await instance.post("/user/login", formData);
      console.log(res);
      if (res.status === 201) {
        if (res.data?.user?.firstTimeSignIn === true) {
          setUser(true);
          navigate("/app/Home");
        } else {
          setTimeout(() => {
            navigate("/profile");
            setUser(true);
          }, 1000);
        }
      }
    } catch (error) {
      console.error(error);
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
    const redirectUri = "http://localhost:5173/linkedin/callback";

    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=openid%20profile%20email`;

    window.location.href = authUrl;
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex items-center justify-center px-4"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div
        className="w-full max-w-md p-10 rounded-2xl border border-white/30 shadow-xl text-white"
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
        }}
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Welcome Back</h2>

        {/* Social Login Buttons */}
        <div className="flex justify-center gap-6 mb-6">
          <button
            className="text-3xl hover:scale-110 transition cursor-pointer"
            onClick={handleGoogleLogin}
          >
            <FcGoogle />
          </button>
          <button
            className="text-3xl text-blue-600 hover:scale-110 transition cursor-pointer"
            onClick={handleLinkedInLogin}
          >
            <FaLinkedin />
          </button>
          <button
            className="text-3xl text-white hover:scale-110 transition cursor-pointer"
            onClick={handleGitHubLogin}
          >
            <ImGithub />
          </button>
        </div>

        <h3 className="text-center text-sm mb-6 text-white/80">
          or Login with email
        </h3>

        {/* Login Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute left-2 top-3 text-white/70" />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-8 py-2 bg-transparent border-b border-white/70 focus:outline-none text-white"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FaLock className="absolute left-2 top-3 text-white/70" />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-8 pr-8 py-2 bg-transparent border-b border-white/70 focus:outline-none text-white"
            />
            <div
              className="absolute right-2 top-3 text-white cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEye /> : <BsFillEyeSlashFill />}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-white text-blue-500 py-2 rounded-full font-bold hover:bg-blue-500 hover:text-white transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-white/80">
          Don't have an account?{" "}
          <Link to="/register">
            {" "}
            <span className="text-cyan-400 font-semibold underline cursor-pointer">
              Register
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
