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
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [available, setAvailable] = useState(null);

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

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files.length > 0) {
      const file = files[0];

      if (file.size > 2 * 1024 * 1024) {
        alert("File size should be less than 2MB");

        e.target.value = "";

        return;
      }

      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));
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
              required={!userDetail?.profilePic}
              className="block w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
            />
          </div>

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
              <Field
                name="userName"
                required
                type="text"
                placeholder="Username"
                value={formData.userName}
                maxLength={15}
                onChange={handleChange}
                onBlur={checkUsername}
                disabled={userDetail?.userName}
                className={`w-full bg-white/5 border border-white/20 rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all duration-300 hover:bg-white/10 ${
                  userDetail?.userName ? "opacity-60 cursor-not-allowed" : ""
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
  onBlur,
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
      onBlur={onBlur}
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
