import { useEffect, useState } from "react";
import instance from "./axiosConfig.js";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  FileText,
  Camera,
  Edit3,
} from "lucide-react";

function Profile() {
  const navigate = useNavigate();
  const [userDetail, setUserDetail] = useState();
  const [firstTimeSignIn, setFirstTimeSignIn] = useState();

  // useEffect(() => {
  //   async function fetchUser() {
  //     try {
  //       const res = await instance.get("/api/users/me");
  //       console.log(res);

  //        if (res.data.user.firstTimeSignIn === true) {
  //     setFirstTimeSignIn(true);
  //   }
  //        if (firstTimeSignIn === true) {
  //     navigate("/homePage");
  //   }
  //       setUserDetail(res.data);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   }
  //   fetchUser();
  // }, []);
  // useEffect(() => {
  //   if (firstTimeSignIn === true) {
  //     navigate("/homePage");
  //   }
  // }, [firstTimeSignIn, navigate]);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await instance.get("/api/users/me");
        console.log("Deepesh", res);

        setUserDetail(res.data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchUser();
  }, []);

  useEffect(() => {
    if (firstTimeSignIn === true) {
      navigate("/homePage");
    }
  }, [firstTimeSignIn, navigate]);

  useEffect(() => {
    if (userDetail) {
      setFormData({
        name: userDetail.name || "",
        userName: userDetail.userName || "",
        email: userDetail.email || "",
        phone: userDetail.phone || "",
        bio: userDetail.bio || "",
        dob: userDetail.dob || "",
        gender: userDetail.gender || "",
        city: userDetail.city || "",
        state: userDetail.state || "",
        address: userDetail.address || "",
        image: null,
      });
    }
  }, [userDetail]);

  const [formData, setFormData] = useState({
    name: "",
    userName: "",
    email: "",
    phone: "",
    bio: "",
    dob: "",
    gender: "",
    city: "",
    state: "",
    address: "",
    image: null,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await instance.put("/user/profile", {
      ...formData,
      firstTimeSignIn: true,
    });

    console.log("Deepesh", res);
    if (res.data.user.firstTimeSignIn === true) {
      setFirstTimeSignIn(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements (fixed animation delay) */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
        <div
          className="absolute -bottom-8 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        <form
          onSubmit={handleSubmit}
          className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 transform hover:scale-[1.02]"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4 shadow-lg">
              <Edit3 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-2">
              Edit Profile
            </h2>
            <p className="text-white/70">
              Update your information and make it shine
            </p>
          </div>

          {/* Profile Image Upload */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-1 shadow-2xl">
                <div className="w-full h-full rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                  {formData.image ? (
                    <img
                      src={URL.createObjectURL(formData.image)}
                      alt="Profile Preview"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <User className="w-16 h-16 text-white/70" />
                  )}
                </div>
              </div>
              <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-110">
                <Camera className="w-5 h-5 text-white" />
                <input
                  type="file"
                  name="image"
                  onChange={handleChange}
                  className="hidden"
                  accept="image/*"
                />
              </label>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Name */}
            <Field
              icon={<User />}
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
            />
            {/* Username */}
            <Field
              icon={<User />}
              name="userName"
              placeholder="UserName"
              value={formData.userName}
              onChange={handleChange}
              disabled={userDetail?.userName ? true : false}
            />
            {/* Email */}
            <Field
              icon={<Mail />}
              name="email"
              placeholder="Email"
              value={formData.email}
              type="email"
              onChange={handleChange}
              disabled
            />
            {/* Phone */}
            <Field
              icon={<Phone />}
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
            />
            {/* DOB */}
            <Field
              icon={<Calendar />}
              name="dob"
              value={formData.dob}
              type="date"
              onChange={handleChange}
            />
            {/* Gender */}
            <div className="group relative">
              <Users className="absolute left-3 top-3 w-5 h-5 text-white/60" />
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/20 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all duration-300 hover:bg-white/10 appearance-none"
              >
                <option value="" className="bg-gray-800">
                  Select Gender
                </option>
                <option value="male" className="bg-gray-800">
                  Male
                </option>
                <option value="female" className="bg-gray-800">
                  Female
                </option>
                <option value="other" className="bg-gray-800">
                  Other
                </option>
              </select>
            </div>
            {/* City */}
            <Field
              icon={<MapPin />}
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
            />
            {/* State */}
            <Field
              icon={<MapPin />}
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleChange}
            />
          </div>

          {/* Bio and Address */}
          <div className="space-y-6 mb-8">
            <TextArea
              icon={<MapPin />}
              name="address"
              placeholder="Full Address"
              rows="3"
              value={formData.address}
              onChange={handleChange}
            />
            <TextArea
              icon={<FileText />}
              name="bio"
              placeholder="Tell us about yourself..."
              rows="4"
              value={formData.bio}
              onChange={handleChange}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Saving Profile...</span>
              </>
            ) : (
              <span>Save Profile</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

// Updated Field component to accept disabled and style it properly
const Field = ({
  icon,
  name,
  placeholder,
  type = "text",
  value,
  onChange,
  disabled = false,
}) => (
  <div className="group relative">
    <div className="absolute left-3 top-3 w-5 h-5 text-white/60">{icon}</div>
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full bg-white/5 border border-white/20 rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all duration-300 hover:bg-white/10 ${
        disabled ? "opacity-60 cursor-not-allowed" : ""
      }`}
    />
  </div>
);

const TextArea = ({ icon, name, placeholder, rows, value, onChange }) => (
  <div className="group relative">
    <div className="absolute left-3 top-3 w-5 h-5 text-white/60">{icon}</div>
    <textarea
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rows={rows}
      className="w-full bg-white/5 border border-white/20 rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all duration-300 hover:bg-white/10 resize-none"
    />
  </div>
);

export default Profile;
