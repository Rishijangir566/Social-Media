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

  useEffect(() => {
    fetchUserAndProfiles();
  }, []);
  useEffect(() => {
    console.log("Friend Data:", friendData);
  }, [friendData]);

  // Fetch current user and all profiles
  async function fetchUserAndProfiles() {
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
          !friendRes.data.connections?.includes(profile.uniqueId)
      );

      setProfiles(filteredProfiles);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch profiles.");
    }
  }

  // Fetch sentRequests, receivedRequests, connections
  async function fetchFriendData(userId) {
    try {
      const response = await instance.get(`/api/users/request/${userId}`);

      setFriendData(response.data);
    } catch (error) {
      console.error("Error fetching friend data:", error);
    }
  }

  // Send connection request
  async function sendRequest(receiverId) {
    if (!receiverId) return;

    try {
      const response = await instance.post(
        `/api/users/send_request/${receiverId}`
      );

      if (response.status === 200) {
        toast.success("Friend request sent!");
        await fetchFriendData(userId);
      }
    } catch (error) {
      toast.error("Failed to send request.");
      console.error(error);
    }
  }

  // Check if request is already pending
  const isRequestPending = (receiverId) => {
    return friendData?.sentRequests?.includes(receiverId);
  };

  if (error) return <div>{error}</div>;

  return (
    <div className="pl-[5%] pt-10 w-full min-h-screen bg-gradient-to-br from-blue-900 via-blue-900 to-indigo-900 text-white mt-10">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">All Profiles</h1>

      <ul className="space-y-4 flex flex-wrap gap-4">
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

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                <button
                  onClick={() => sendRequest(profileId)}
                  disabled={isRequestPending(profileId)}
                  className={`text-[15px] border py-1.5 px-5 rounded-2xl cursor-pointer ${
                    isRequestPending(profileId)
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {isRequestPending(profileId) ? "Pending" : "Connect"}
                </button>
              </div>
            </div>
          );
        })}
      </ul>
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
