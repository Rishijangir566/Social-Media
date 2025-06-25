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
} from "lucide-react";

function Profile() {
  const navigate = useNavigate();
  const [userDetail, setUserDetail] = useState(null);
  const [firstTimeSignIn, setFirstTimeSignIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

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
    profilePic: null,
  });

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await instance.get("/api/users/me");
        console.log(res);
        setUserDetail(res.data);
      } catch (err) {
        console.error("Fetch user failed:", err);
      }
    }
    fetchUser();
  }, []);

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
        profilePic: null,
      });
    }
  }, [userDetail]);

  useEffect(() => {
    if (formData.userName.trim().length > 2 && !userDetail?.userName) {
      const delay = setTimeout(() => {
        checkUsernameAvailability(formData.userName);
      }, 500);
      return () => clearTimeout(delay);
    } else {
      setIsUsernameAvailable(null);
    }
  }, [formData.userName]);

  const checkUsernameAvailability = async (username) => {
    try {
      setCheckingUsername(true);
      const res = await instance.get(
        `/check-username?username=${username.trim().toLowerCase()}`
      );
      setIsUsernameAvailable(res.data.available);
    } catch (err) {
      console.error("Username check failed:", err);
      setIsUsernameAvailable(null);
    } finally {
      setCheckingUsername(false);
    }
  };

  useEffect(() => {
    if (firstTimeSignIn === true) {
      navigate("/app/Home");
    }
  }, [firstTimeSignIn, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.profilePic) {
      alert("Please upload a profile image.");
      return;
    }

    if (!userDetail?.userName && isUsernameAvailable === false) {
      alert("Username is already taken. Please choose another one.");
      return;
    }

    const data = new FormData();
    for (let key in formData) {
      if (formData[key]) data.append(key, formData[key]);
    }
    data.append("firstTimeSignIn", true);

    try {
      setIsLoading(true);
      const res = await instance.put("/user/profile", data);
      // console.log(res);
      if (res.data?.user?.firstTimeSignIn) {
        setFirstTimeSignIn(true);
      }
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-20 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center min-h-screen p-4 relative">
      <div className="relative z-10 w-full max-w-4xl">
        <form
          onSubmit={handleSubmit}
          className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Edit Profile
          </h2>
          {(formData.profilePic || userDetail?.profilePic) && (
            <img
              src={
                formData.profilePic
                  ? URL.createObjectURL(formData.profilePic)
                  : userDetail.profilePic
              }
              alt="Preview"
              className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
            />
          )}

          <div className="mb-6">
            <input
              type="file"
              name="profilePic"
              accept="image/*"
              onChange={handleChange}
              required
              className="block w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
            />
          </div>

          {/* {formData.profilePic && (
            <img
              src={formData.profilePic}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
            />
          )} */}

          <Field
            icon={<User />}
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            maxLength={30}
          />

          <div className="mb-4">
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-white/60" />
              <input
                name="userName"
                required
                type="text"
                placeholder="Username"
                value={formData.userName}
                maxLength={20}
                onChange={handleChange}
                disabled={userDetail?.userName}
                className={`w-full bg-white/5 border ${
                  isUsernameAvailable === false
                    ? "border-red-500"
                    : "border-white/20"
                } rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all duration-300 hover:bg-white/10 ${
                  userDetail?.userName ? "opacity-60 cursor-not-allowed" : ""
                }`}
              />
            </div>
            {!userDetail?.userName && (
              <div className="text-sm text-white mt-1 min-h-[1.25rem]">
                {checkingUsername && (
                  <span className="text-yellow-400">Checking username...</span>
                )}
                {!checkingUsername && isUsernameAvailable === false && (
                  <span className="text-red-500">
                    ❌ Username already taken
                  </span>
                )}
                {!checkingUsername && isUsernameAvailable === true && (
                  <span className="text-green-400">
                    ✅ Username is available
                  </span>
                )}
              </div>
            )}
          </div>

          <Field
            icon={<Mail />}
            name="email"
            placeholder="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled
          />

          <Field
            icon={<Phone />}
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            pattern="\d{10}"
            maxLength={10}
            minLength={10}
          />

          <Field
            icon={<Calendar />}
            name="dob"
            type="date"
            value={formData.dob}
            onChange={handleChange}
          />

          <div className="mb-4 relative">
            <Users className="absolute left-3 top-3 w-5 h-5 text-white/60" />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/20 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-purple-400 focus:bg-white/10 hover:bg-white/10"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <Field
            icon={<MapPin />}
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            maxLength={10}
          />

          <Field
            icon={<MapPin />}
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
            maxLength={10}
          />

          <TextArea
            icon={<MapPin />}
            name="address"
            placeholder="Full Address"
            rows="3"
            value={formData.address}
            onChange={handleChange}
            maxLength={50}
          />

          <TextArea
            icon={<FileText />}
            name="bio"
            placeholder="Tell us about yourself..."
            rows="4"
            value={formData.bio}
            onChange={handleChange}
            maxLength={100}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
          >
            {isLoading ? "Saving Profile..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}

const Field = ({
  icon,
  name,
  placeholder,
  type = "text",
  value,
  onChange,
  disabled = false,
}) => (
  <div className="group relative mb-4">
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
  <div className="group relative mb-4">
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
