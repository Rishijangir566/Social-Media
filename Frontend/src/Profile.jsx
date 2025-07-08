import { useEffect, useState } from "react";
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
  Heart,
  Star,
  Sparkles,
} from "lucide-react";
import instance from "./axiosConfig.js";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const [userDetail, setUserDetail] = useState(null);
  const [firstTimeSignIn, setFirstTimeSignIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [available, setAvailable] = useState(null);

  const [imagePreview, setImagePreview] = useState(null);

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

  const checkUsername = async () => {
    if (!username.trim()) {
      setMessage("");
      setAvailable(null);
      return;
    }

    try {
      const res = await instance.get(
        `/api/users/check-username?username=${username}`
      );
      if (res.data.available) {
        setAvailable(true);
        setMessage("Username is available");
      } else {
        setAvailable(false);
        setMessage("Username is already taken");
      }
    } catch {
      setAvailable(false);
      setMessage("Error checking username");
    }
  };
  useEffect(() => {
    if (firstTimeSignIn === true) {
      navigate("/app/Home");
    }
  }, [firstTimeSignIn, navigate]);

  // const handleChange = (e) => {
  //   const { name, value, files } = e.target;

  //   if (files && files.length > 0) {
  //     const file = files[0];

  //     if (file.size > 2 * 1024 * 1024) {
  //       alert("File size should be less than 2MB");

  //       e.target.value = "";

  //       return;
  //     }

  //     setFormData((prev) => ({
  //       ...prev,
  //       [name]: file,
  //     }));
  //   } else {
  //     setFormData((prev) => ({
  //       ...prev,
  //       [name]: value,
  //     }));

  //     if (name === "userName") {
  //       setUsername(value);
  //     }
  //   }
  // };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files.length > 0) {
      const file = files[0];

      if (file.size > 2 * 1024 * 1024) {
        alert("File size should be less than 2MB");
        e.target.value = "";
        return;
      }

      // Set form data and preview image
      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));

      // Generate preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (name === "userName") {
        setUsername(value);
      }
    }
  };

  const handleSubmit = async (e) => {
    console.log("first");
    e.preventDefault();

    if (!formData.profilePic && !userDetail?.profilePic) {
      alert("Please upload a profile image.");
      return;
    }

    if (!formData.userName) {
      alert("User Name is Required!");
    }
    if (formData.userName.length < 5) {
      alert("Username must be at least 5 characters long.");
      return;
    }
    // if (!available) {
    //   alert("User Name already taken");
    // }

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
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          >
            <Sparkles className="w-4 h-4 text-white/20" />
          </div>
        ))}
      </div>

      <div className="relative z-10 pt-20 pb-10 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                <Edit3 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl md:text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Edit Profile
              </h1>
            </div>
            <p className="text-white/70 text-small max-w-2xl mx-auto">
              Update your profile to reflect your personal and professional identity.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Picture Section */}
            {/* <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl"> */}
              <div className="text-center">
                <div className="relative inline-block group">
                  <div className="relative">
                    <div className="w-24 h-24 md:w-30 md:h-30 mx-auto rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 p-1 shadow-2xl">
                      <div className="w-full h-full rounded-full bg-white/10 backdrop-blur-sm overflow-hidden">
                        {imagePreview || userDetail?.profilePic ? (
                          <img
                            src={imagePreview || userDetail?.profilePic}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="w-12 h-12 text-white/60" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <input
                    type="file"
                    name="profilePic"
                    accept="image/*"
                    onChange={handleChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <p className="mt-4 text-white/70 text-sm">
                  Click to upload your profile picture
                </p>
              </div>
            {/* </div> */}

            {/* Form Fields */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Heart className="w-6 h-6 text-pink-400" />
                  Personal Info
                </h3>
                <div className="space-y-4">
                  <AnimatedField
                    icon={<User />}
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    maxLength={30}
                  />

                  <div className="space-y-2">
                    <AnimatedField
                      icon={<User />}
                      required
                      name="userName"
                      placeholder="Username"
                      value={formData.userName}
                      onChange={handleChange}
                      onBlur={checkUsername}
                      maxLength={15}
                      disabled={userDetail?.userName}
                      className={`w-full bg-white/5 border border-white/20 rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all duration-300 hover:bg-white/10 ${
                        userDetail?.userName
                          ? "opacity-60 cursor-not-allowed"
                          : ""
                      }`}
                    />
                    {username.length > 5 && message ? (
                      <p
                        className={`text-sm mt-1 ${
                          available ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {message}
                      </p>
                    ) : null}
                  </div>

                  <AnimatedField
                    icon={<Mail />}
                    name="email"
                    placeholder="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled
                  />

                  <AnimatedField
                    icon={<Phone />}
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    pattern="\d{10}"
                    maxLength={10}
                  />

                  <AnimatedField
                    icon={<Calendar />}
                    name="dob"
                    type="date"
                    value={formData.dob}
                    onChange={handleChange}
                  />

                  <div className="relative group">
                    <Users className="absolute left-4 top-4 w-5 h-5 text-white/60 group-focus-within:text-purple-400 transition-colors duration-300" />
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/20 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-purple-400 focus:bg-white/10 hover:bg-white/10 transition-all duration-300"
                    >
                      <option value="" className="text-black">
                        Select Gender
                      </option>
                      <option value="male" className="text-black">
                        Male
                      </option>
                      <option value="female" className="text-black">
                        Female
                      </option>
                      <option value="other" className="text-black">
                        Other
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Location & Bio */}
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-blue-400" />
                  Location & Bio
                </h3>
                <div className="space-y-4">
                  <AnimatedField
                    icon={<MapPin />}
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    maxLength={10}
                  />

                  <AnimatedField
                    icon={<MapPin />}
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleChange}
                    maxLength={10}
                  />

                  <AnimatedTextArea
                    icon={<MapPin />}
                    name="address"
                    placeholder="Full Address"
                    rows="3"
                    value={formData.address}
                    onChange={handleChange}
                    maxLength={50}
                  />

                  <AnimatedTextArea
                    icon={<FileText />}
                    name="bio"
                    placeholder="Tell us about yourself..."
                    rows="4"
                    value={formData.bio}
                    onChange={handleChange}
                    maxLength={100}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={isLoading}
                className="group relative px-12 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-purple-500/25 disabled:opacity-50 transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center gap-3">
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Saving Profile...
                    </>
                  ) : (
                    <>
                      <Star className="w-5 h-5" />
                      Save Profile
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const AnimatedField = ({
  icon,
  name,
  placeholder,
  type = "text",
  value,
  onBlur,
  onChange,
  disabled = false,
  maxLength,
  pattern,
}) => (
  <div className="relative group">
    <div className="absolute left-4 top-4 w-5 h-5 text-white/60 group-focus-within:text-purple-400 transition-colors duration-300">
      {icon}
    </div>
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onBlur={onBlur}
      onChange={onChange}
      disabled={disabled}
      maxLength={maxLength}
      pattern={pattern}
      className={`w-full bg-white/5 border border-white/20 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-white/60 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all duration-300 hover:bg-white/10 hover:border-white/30 ${
        disabled ? "opacity-60 cursor-not-allowed" : ""
      }`}
    />
    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></div>
  </div>
);

const AnimatedTextArea = ({
  icon,
  name,
  placeholder,
  rows,
  value,
  onChange,
  maxLength,
}) => (
  <div className="relative group">
    <div className="absolute left-4 top-4 w-5 h-5 text-white/60 group-focus-within:text-purple-400 transition-colors duration-300">
      {icon}
    </div>
    <textarea
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rows={rows}
      maxLength={maxLength}
      className="w-full bg-white/5 border border-white/20 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-white/60 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all duration-300 hover:bg-white/10 hover:border-white/30 resize-none"
    />
    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></div>
  </div>
);

export default Profile;
