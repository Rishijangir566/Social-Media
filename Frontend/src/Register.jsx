// import { useState } from "react";
// import { FaUser, FaEnvelope, FaLock, FaEye } from "react-icons/fa";
// import { BsFillEyeSlashFill } from "react-icons/bs";
// import bgImage from "./assets/RegisterForm.png";
// import { Link } from "react-router-dom";
// import instance from "./axiosConfig.js";

// function Register() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [confirmPassword, setConfirmPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });

//   function handleChange(e) {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   }

//   async function handleSubmit(e) {
//     e.preventDefault();
//     const response = await instance.post("/user/register", formData, {
//       withCredentials: true,
//     });
//     console.log(response);
//   }

//   return (
//     <div
//       className="min-h-screen w-full bg-cover bg-center flex items-center justify-center px-4"
//       style={{ backgroundImage: `url(${bgImage})` }}
//     >
//       <div
//         className="w-full max-w-md p-10 rounded-2xl border border-white/30 shadow-xl text-white"
//         style={{
//           background: "rgba(255, 255, 255, 0.1)",
//           backdropFilter: "blur(10px)",
//         }}
//       >
//         <h2 className="text-3xl font-bold mb-6 text-center">Welcome</h2>

//         {/* Form */}
//         <form className="space-y-6" onSubmit={handleSubmit}>
//           {/* Name */}
//           <div className="relative">
//             <FaUser className="absolute left-2 top-3 text-white/70" />
//             <input
//               name="name"
//               type="text"
//               placeholder="User Name:"
//               value={formData.name}
//               onChange={handleChange}
//               className="w-full pl-8 py-2 bg-transparent border-b border-white/70 focus:outline-none text-white"
//             />
//           </div>

//           {/* Email */}
//           <div className="relative">
//             <FaEnvelope className="absolute left-2 top-3 text-white/70" />
//             <input
//               name="email"
//               type="email"
//               placeholder="Email"
//               value={formData.email}
//               onChange={handleChange}
//               className="w-full pl-8 py-2 bg-transparent border-b border-white/70 focus:outline-none text-white"
//             />
//           </div>

//           {/* Password */}
//           <div className="relative">
//             <FaLock className="absolute left-2 top-3 text-white/70" />
//             <input
//               name="password"
//               type={showPassword ? "text" : "password"}
//               placeholder="Password"
//               value={formData.password}
//               onChange={handleChange}
//               className="w-full pl-8 pr-8 py-2 bg-transparent border-b border-white/70 focus:outline-none text-white"
//             />
//             <div
//               className="absolute right-2 top-3 text-white cursor-pointer"
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               {showPassword ? <FaEye /> : <BsFillEyeSlashFill />}
//             </div>
//           </div>

//           <div className="relative">
//             <FaLock className="absolute left-2 top-3 text-white/70" />
//             <input
//               name="password"
//               type={confirmPassword ? "text" : "password"}
//               placeholder="Confirm Password"
//               value={formData.password}
//               onChange={handleChange}
//               className="w-full pl-8 pr-8 py-2 bg-transparent border-b border-white/70 focus:outline-none text-white"
//             />
//             <div
//               className="absolute right-2 top-3 text-white cursor-pointer"
//               onClick={() => setConfirmPassword(!confirmPassword)}
//             >
//               {confirmPassword ? <FaEye /> : <BsFillEyeSlashFill />}
//             </div>
//           </div>

//           {/* Submit */}
//           <button
//             type="submit"
//             className="w-full bg-white text-blue-500 py-2 rounded-full font-bold hover:bg-blue-500 hover:text-white transition"
//           >
//             Register
//           </button>
//         </form>

//         <p className="text-center text-sm mt-4 text-white/80">
//           Already have an account?{" "}
//           <Link to="/">
//             {" "}
//             <span className="text-cyan-400 font-semibold underline cursor-pointer">
//               Login
//             </span>
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }

// export default Register;

import { useState } from "react";
import { FaUser, FaEnvelope, FaLock, FaEye } from "react-icons/fa";
import { BsFillEyeSlashFill } from "react-icons/bs";
import bgImage from "./assets/RegisterForm.png";
import { Link } from "react-router-dom";
import instance from "./axiosConfig.js";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Optional: Add a password match check
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const { name, email, password } = formData;
    const response = await instance.post(
      "/user/register",
      { name, email, password },
      { withCredentials: true }
    );
    console.log(response);
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
        <h2 className="text-3xl font-bold mb-6 text-center">Welcome</h2>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="relative">
            <FaUser className="absolute left-2 top-3 text-white/70" />
            <input
              name="name"
              type="text"
              placeholder="User Name:"
              value={formData.name}
              onChange={handleChange}
              className="w-full pl-8 py-2 bg-transparent border-b border-white/70 focus:outline-none text-white"
            />
          </div>

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

          {/* Confirm Password */}
          <div className="relative">
            <FaLock className="absolute left-2 top-3 text-white/70" />
            <input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full pl-8 pr-8 py-2 bg-transparent border-b border-white/70 focus:outline-none text-white"
            />
            <div
              className="absolute right-2 top-3 text-white cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEye /> : <BsFillEyeSlashFill />}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-white text-blue-500 py-2 rounded-full font-bold hover:bg-blue-500 hover:text-white transition"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-white/80">
          Already have an account?{" "}
          <Link to="/">
            <span className="text-cyan-400 font-semibold underline cursor-pointer">
              Login
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
