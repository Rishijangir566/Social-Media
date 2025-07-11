import { useEffect, useState } from "react";
import instance from "./axiosConfig";
import ProfileImg from "./assets/Icons.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Sparkles } from "lucide-react";

const HomePage = () => {
  const [profiles, setProfiles] = useState([]);
  const [userId, setUserId] = useState(null);
  const [friendData, setFriendData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserAndProfiles();
  }, []);

  useEffect(() => {
    console.log("Friend Data:", friendData);
  }, [friendData]);

  async function fetchUserAndProfiles() {
    setLoading(true);
    try {
      const userRes = await instance.get("/api/users/me");
      const mainUser = userRes.data;
      setUserId(mainUser.uniqueId);

      const friendRes = await instance.get(
        `/api/users/request/${mainUser.uniqueId}`
      );
      setFriendData(friendRes.data);

      const allProfilesRes = await instance.get("/api/users/allprofiles");

      const filteredProfiles = allProfilesRes.data.filter(
        (profile) =>
          profile.uniqueId !== mainUser.uniqueId &&
          !friendRes?.data?.connections?.includes(profile.uniqueId)
      );

      setProfiles(filteredProfiles);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch profiles.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchFriendData(userId) {
    try {
      const response = await instance.get(`/api/users/request/${userId}`);
      setFriendData(response.data);
    } catch (error) {
      console.error("Error fetching friend data:", error);
    }
  }

  async function sendRequest(receiverId) {
    if (!receiverId) return;

    try {
      const response = await instance.post(
        `/api/users/send_request/${receiverId}`
      );

      if (response.status === 200) {
        toast.success("Friend request sent!", {
          position: "top-right",
          autoClose: 700,
        });
        await fetchFriendData(userId);
      }
    } catch (error) {
      toast.error("Failed to send request.", {
        position: "top-right",
        autoClose: 2000,
      });
      console.error(error);
    }
  }

  const isRequestPending = (receiverId) => {
    return friendData?.sentRequests?.includes(receiverId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900">
        <div className="text-center py-20">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-400/20 rounded-full mx-auto mb-6"></div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-16 border-4 border-transparent border-t-purple-400 rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-300 text-lg">Loading Profiles...</p>
        </div>
      </div>
    );
  }

  if (error) return <div>{error}</div>;

  return (
    <div className="pl-[5%] pt-10 pb-5 w-full min-h-screen bg-gradient-to-br from-blue-900 via-blue-900 to-indigo-900 text-white mt-10">
      <ToastContainer />

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
            All Profiles
          </h1>
          <p className="text-slate-400 mt-1">
            Discover people and grow your network
          </p>
        </div>
      </div>

      {/* Profiles List Styled like Notification Cards */}
      <ul className="space-y-4 flex flex-wrap gap-4 mt-10">
        {profiles.map((profile, index) => {
          const profileId = profile.uniqueId;

          return (
            <div
              key={index}
              className="w-[260px] h-[300px] rounded-xl shadow-md border border-gray-400 relative bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900"
            >
              <div className="h-[90px] rounded-t-xl relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-10 w-[80px] h-[80px] rounded-full bg-gray-200 border-3 border-white overflow-hidden">
                  <img
                    src={profile.profilePic || ProfileImg}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="pt-14 px-4 text-center">
                <p className="font-semibold text-white text-[16px]">
                  {profile.userName || profile.name}
                </p>
                <p className="text-gray-400 text-sm mt-1">{profile.email}</p>
              </div>

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <button
                  onClick={() => sendRequest(profileId)}
                  disabled={isRequestPending(profileId)}
                  className={`text-[15px] border py-1.5 px-5 rounded-2xl cursor-pointer transition-all duration-300 ${
                    isRequestPending(profileId)
                      ? "text-yellow-400 border-yellow-400 opacity-60 cursor-not-allowed"
                      : "text-blue-400 border-blue-400 hover:bg-blue-700 hover:text-white"
                  }`}
                >
                  {isRequestPending(profileId) ? "Pending" : "Connect"}
                </button>
              </div>
            </div>
          );
        })}
      </ul>

      {/* Empty State */}
      {profiles.length === 0 && !error && (
        <div className="text-center py-20 mt-20">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mx-auto flex items-center justify-center">
              <Sparkles className="text-white w-10 h-10" />
            </div>
          </div>
          <h3 className="text-slate-300 text-xl font-medium mb-2">
            No profiles found yet!
          </h3>
          <p className="text-slate-400">
            No one except you has logged in with this application.
          </p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
