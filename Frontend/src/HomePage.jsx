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

  // const [pendingRequests, setPendingRequests] = useState([]);
  // const [acceptedConnections, setAcceptedConnections] = useState([]);
  // const [rejectedRequests, setRejectedRequests] = useState([]);

  // ✅ Fetch initial data
  useEffect(() => {
    fetchAllData();
  }, []);

  // ✅ Setup socket listeners for accept/reject
  // useEffect(() => {
  //   socket.on("request_accepted", ({ senderId, receiverId }) => {
  //     if (senderId === userId) {
  //       setAcceptedConnections((prev) => [...prev, receiverId]);
  //       setPendingRequests((prev) => prev.filter((id) => id !== receiverId));
  //       toast.success("Your connection request was accepted!");
  //     }
  //   });

  //   socket.on("request_rejected", ({ senderId, receiverId }) => {
  //     if (senderId === userId) {
  //       setRejectedRequests((prev) => [...prev, receiverId]);
  //       setPendingRequests((prev) => prev.filter((id) => id !== receiverId));
  //       toast.info("Your connection request was rejected.");
  //     }
  //   });

  //   return () => {
  //     socket.off("request_accepted");
  //     socket.off("request_rejected");
  //   };
  // }, [userId]);

  // ✅ Socket listener for send request success/error
  // useEffect(() => {
  //   socket.on("request_sent", ({ receiverId }) => {
  //     setPendingRequests((prev) => [...prev, receiverId]);
  //     toast.success("Connection request sent!");
  //   });

  //   socket.on("request_error", ({ error }) => {
  //     toast.error(`Error: ${error}`);
  //   });

  //   return () => {
  //     socket.off("request_sent");
  //     socket.off("request_error");
  //   };
  // }, []);

  // ✅ Get user and profiles
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

  // ✅ Emit connection request
  // const sendConnectionRequest = (receiverId) => {
  //   if (!socket.connected) {
  //     console.error("⚠️ Socket not connected!");
  //     toast.error("Socket not connected!");
  //     return;
  //   }
    
  //   socket.emit("send_connection_request", {
  //     senderId: userId,
  //     receiverId,
  //   });
  //   console.log("first")
  // };

  // ✅ UI logic
  // const getButtonLabel = (profileId) => {
  //   if (acceptedConnections.includes(profileId)) return "Message";
  //   if (pendingRequests.includes(profileId)) return "Pending";
  //   if (rejectedRequests.includes(profileId)) return "Rejected";
  //   return "Connect";
  // };

  const isButtonDisabled = (profileId) => {
    return pendingRequests.includes(profileId) || rejectedRequests.includes(profileId);
  };

  const handleMessageClick = (profileId) => {
    alert(`Start messaging with user ID: ${profileId}`);
  };

  if (error) return <div>{error}</div>;

  return (
    <div className="pl-[5%] pt-10 w-[100%] mt-15">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">All Profiles</h1>
      <ul className="space-y-4 flex flex-wrap gap-4">
        {profiles.map((profile, index) => {
          const profileId = profile.uniqueId;
          const label = getButtonLabel(profileId);
          const disabled = isButtonDisabled(profileId);

          return (
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

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                {label === "Message" ? (
                  <button
                    onClick={() => handleMessageClick(profileId)}
                    className="text-[15px] bg-blue-500 text-white py-1.5 px-5 rounded-2xl cursor-pointer"
                  >
                    Message
                  </button>
                ) : (
                  <button
                    onClick={() => sendConnectionRequest(profileId)}
                    className={`text-[15px] border py-1.5 px-5 rounded-2xl cursor-pointer ${
                      disabled ? "bg-gray-300 text-gray-600 cursor-not-allowed" : ""
                    }`}
                    disabled={disabled}
                  >
                    {label}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </ul>
    </div>
  );
};

export default HomePage;
