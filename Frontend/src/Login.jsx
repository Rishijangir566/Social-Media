import { useState } from "react";
import bgImage from "./assets/RegisterForm.png";
import { FaEnvelope, FaLock, FaEye } from "react-icons/fa";
import { BsFillEyeSlashFill } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { FaLinkedin } from "react-icons/fa6";
import { ImGithub } from "react-icons/im";
import { Link, useNavigate } from "react-router-dom";
import instance from "./axiosConfig";


function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });



  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await instance.post("/user/login", formData);
      if (response.status === 201) {
        
        navigate("/profile");
      }
    } catch (error) {
      console.error(error);
      
    }
  }

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
          <button className="text-3xl hover:scale-110 transition">
            <FcGoogle />
          </button>
          <button className="text-3xl text-blue-600 hover:scale-110 transition">
            <FaLinkedin />
          </button>
          <button className="text-3xl text-white hover:scale-110 transition">
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
