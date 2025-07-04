import React, { useEffect, useState } from "react";
import instance from "./axiosConfig";
import ProfileImg from "./assets/Icons.png";
// import io from "socket.io-client";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// const SOCKET_SERVER_URL = import.meta.env.VITE_BACKEND_URL;
// const socket = io(SOCKET_SERVER_URL, {
//   withCredentials: true,
// });

const HomePage = () => {
  const [profiles, setProfiles] = useState([]);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  async function fetchAllData() {
    try {
      const userRes = await instance.get("/api/users/me");
      const mainUser = userRes.data;
      setUserId(mainUser.uniqueId);

      const allProfilesRes = await instance.get("/api/users/allprofiles");
      const filteredProfiles = allProfilesRes.data.filter(
        (profile) => profile.uniqueId !== mainUser.uniqueId
      );
      setProfiles(filteredProfiles);
    } catch (err) {
      setError("Failed to fetch profiles.");
      console.error(err);
    }
  }

  if (error) return <div>{error}</div>;

  return (
    <div className="pl-[5%] pt-10 w-[100%] mt-15 min-h-screen bg-gradient-to-br from-blue-900 via-blue-900 to-indigo-900 text-white">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">All Profiles</h1>
      <ul className="space-y-4 flex flex-wrap gap-4">
        {profiles.map((profile, index) => {
          const profileId = profile.uniqueId;

          return (
            <div
              key={index}
              className="w-[260px] h-[300px] rounded-xl shadow-md border relative bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900"
            >
              <div className="h-[90px] rounded-t-xl relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-10 w-[80px] h-[80px] rounded-full bg-gray-200 border-4 border-white overflow-hidden">
                  <img
                    src={profile.profilePic || ProfileImg}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="pt-14 px-4 text-center ">
                <p className="font-semibold text-black text-[16px] text-white">
                  {profile.userName || profile.name}
                </p>
                <p className="text-gray-600 text-sm mt-1 text-white">{profile.email}</p>
              </div>

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <button
                  onClick={() => sendConnectionRequest(profileId)}
                  className="text-[15px] border py-1.5 px-5 rounded-2xl cursor-pointer"
                >
                  Conncet
                </button>
              </div>
            </div>
          );
        })}
      </ul>
    </div>
  );
};

export default HomePage;
