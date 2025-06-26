import React, { useEffect, useState } from "react";
import instance from "./axiosConfig";
import ProfileImg from "./assets/Icons.png";
import bgImage from "./assets/RegisterForm.png";

const HomePage = () => {
  const [profiles, setProfiles] = useState([]);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  // const [requestedIds, setRequestedIds] = useState([]);

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

      // const pendingRes = await instance.get("/api/users/connection/pending"); 
      // setRequests(pendingRes.data);
    } catch (err) {
      setError("Failed to fetch profiles or requests.");
      console.error(err);
    }
  }

  // async function sendRequest(receiverId) {
  //   console.log("sendRequest")
  //   try {
  //     await instance.post("/api/users/connection/send-request", {
  //       receiverId,
  //     });
  //     setRequestedIds((prev) => [...prev, receiverId]);
  //     alert("Connection request sent!");
  //   } catch (err) {
  //     console.error("Failed to send request:", err);
  //     alert("Failed to send request.");
  //   }
  // }

  // async function respondToRequest(requestId, action) {
  //   console.log("respondToRequest")
  //   try {
  //     const res = await instance.post("/api/users/connection/handle-request", {
  //       requestId,
  //       action,
  //     });
  //     alert(res.data.message);
  //     // Refresh requests list
  //     const updated = await instance.get("/api/users/connection/pending");
  //     setRequests(updated.data);
  //   } catch (err) {
  //     console.error("Failed to respond to request:", err);
  //     alert("Error handling request");
  //   }
  // }

  if (error) return <div>{error}</div>;

  return (
    <div className="p-6 ml-8 mt-15">
      <h1 className="text-2xl font-bold mb-4">All Profiles</h1>

      {/* Pending Requests
      {requests.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Pending Requests</h2>
          <div className="space-y-4">
            {requests.map((req) => (
              <div
                key={req._id}
                className="p-4 bg-white shadow-md rounded border flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{req.sender?.userName}</p>
                  <p className="text-sm text-gray-600">{req.sender?.email}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    // onClick={() => respondToRequest(req._id, "accept")}
                    className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                  >
                    Accept
                  </button>
                  <button
                    // onClick={() => respondToRequest(req._id, "reject")}
                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )} */}

      {/* All Profiles */}
      <ul className="space-y-4 flex flex-wrap gap-4">
        {profiles.map((profile, index) => (
          <div
            key={index}
            className="w-[260px] h-[300px] bg-white rounded-xl shadow-md border relative"
          >
            <div
              className="bg-slate-300 h-[90px] rounded-t-xl relative"
              // style={{ backgroundImage: url(`${bgImage}`) }}
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

            <div className="absolute bottom-4 w-full flex justify-center">
              <button
                disabled={requestedIds.includes(profile.uniqueId)}
                className={`border rounded-full px-6 py-1 ${
                  requestedIds.includes(profile._id)
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "border-blue-500 text-blue-500 hover:bg-blue-50"
                }`}
                // onClick={() => sendRequest(profile.uniqueId)}
              >
                {requestedIds.includes(profile.uniqueId) ? "Requested" : "Connect"}
              </button>
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;