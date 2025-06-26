import React, { useEffect, useState } from "react";
import instance from "./axiosConfig";
import ProfileImg from "./assets/Icons.png";

const HomePage = () => {
  const [profiles, setProfiles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAllData();
  }, []);

  async function fetchAllData() {
    try {
      const userRes = await instance.get("/api/users/me");
      const mainUser = userRes.data;

      const allProfilesRes = await instance.get("/api/users/allprofiles");
      const filteredProfiles = allProfilesRes.data.filter(
        (profile) => profile.uniqueId !== mainUser.uniqueId
      );
      setProfiles(filteredProfiles);
    } catch (err) {
      setError("Failed to fetch profiles or requests.");
      console.error(err);
    }
  }

  if (error) return <div>{error}</div>;

  return (
    <div className="p-6 ml-8 mt-15">
      <h1 className="text-2xl font-bold mb-4">All Profiles</h1>

      <ul className="space-y-4 flex flex-wrap gap-4">
        {profiles.map((profile, index) => (
          <div
            key={index}
            className="w-[260px] h-[300px] bg-white rounded-xl shadow-md border relative"
          >
            <div className="bg-slate-300 h-[90px] rounded-t-xl relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-10 w-[80px] h-[80px] rounded-full bg-gray-200 border-4 border-white overflow-hidden">
                <img
                  src={profile.profilePic || ProfileImg}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="pt-14 px-4 text-center">
              <p className="font-semibold text-black text-[16px]">
                {profile.userName || profile.name}
              </p>
              <p className="text-gray-600 text-sm mt-1">{profile.email}</p>
            </div>

            <div className="absolute bottom-4 w-full flex justify-center">
              <button className="text-[15px] border text-blue-500 py-1.5  px-5 rounded-2xl ">
                Connect
              </button>
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
