import React, { useEffect, useState } from "react";
import instance from "./axiosConfig";
import ProfileImg from "./assets/Icons.png";
import bgImage from "./assets/RegisterForm.png";
const HomePage = () => {
  const [profiles, setProfiles] = useState([]);
  //   const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfiles();
  }, []);
  const fetchProfiles = async () => {
    try {
      const res = await instance.get("/api/users/allprofiles");

      console.log("Fetched data:", res.data);
      setProfiles(res.data);
    } catch (err) {
      setError("Failed to fetch profiles.", err);
      console.error(err);
    }
  };
  //   if (loading) return <div>Loading profiles...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <div className="p-6 ml-8 mt-15">
        <h1 className="text-2xl font-bold mb-4">All Profiles</h1>
        <ul className="space-y-4 flex flex-wrap gap-4">
          {profiles.map((profile, index) => (
            <div
              key={index}
              className="w-[260px] h-[300px] bg-white rounded-xl shadow-md border relative"
            >
              {/* Top background with circle overlap */}
              <div
                className="bg-slate-300 h-[90px] rounded-t-xl relative"
                style={{ backgroundImage: `url(${bgImage})` }}
              >
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

              {/* Connect button */}
              <div className="absolute bottom-4 w-full flex justify-center">
                <button className="border border-blue-500 text-blue-500 rounded-full px-6 py-1 hover:bg-blue-50">
                  Connect
                </button>
              </div>

              {/* Close Icon */}
            </div>
          ))}
        </ul>
      </div>
    </>
  );
};

export default HomePage;
