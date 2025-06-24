import React, { useEffect, useState } from "react";
import instance from "./axiosConfig";

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
      <div className="p-6 ml-8">
        <h1 className="text-2xl font-bold mb-4">All Profiles</h1>
        <ul className="space-y-2">
          {profiles.map((profile, index) => (
            <li key={index} className="p-4 bg-gray-100 rounded shadow">
              <img src="" alt="tanmay" />
              <p>
                <strong>Name:</strong> {profile.name}
              </p>
              <p>
                <strong>Email:</strong> {profile.email}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default HomePage;
