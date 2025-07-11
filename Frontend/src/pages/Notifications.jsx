import { useEffect, useState } from "react";
import instance from "../axiosConfig";
import ProfileImg from "../assets/Icons.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Sparkles } from "lucide-react";

function Notifications() {
  const [userId, setUserId] = useState(null);
  const [friendRequest, setFriendRequest] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserAndProfiles();
  }, []);

  async function fetchUserAndProfiles() {
    setLoading(true);
    try {
      const userRes = await instance.get("/api/users/me");
      const mainUser = userRes.data;
      setUserId(mainUser.uniqueId);
      await fetchFriendData(mainUser.uniqueId);
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
      if (response?.data?.receivedRequests) {
        await fetchRequestDetail(response?.data?.receivedRequests);
      }
    } catch (error) {
      console.error("Error fetching friend data:", error);
    }
  }

  async function fetchRequestDetail(requestArray) {
    try {
      const promises = requestArray.map((id) =>
        instance.get(`/api/users/all-request/${id}`)
      );
      const responses = await Promise.all(promises);
      const requestData = responses.map((res) => res.data);
      const reverseRequestData = [...requestData].reverse();
      setFriendRequest(reverseRequestData);
    } catch (error) {
      console.error("Error fetching request details:", error);
      setError("Failed to fetch request details.");
    }
  }

  async function acceptRequest(requestId) {
    try {
      const response = await instance.put(`/api/users/accept/${requestId}`, {
        senderID: userId,
      });

      if (response.status === 200 && response?.data) {
        toast.success("Friend request accepted!", {
          position: "top-right",
          autoClose: 700,
        });
        setTimeout(() => {
          setFriendRequest((prev) =>
            prev.filter((user) => user.uniqueId !== requestId)
          );
        }, 1400);
      } else {
        toast.warn(`Unexpected response: ${response.status}`);
      }
    } catch (error) {
      console.error("Accept error:", error);
      toast.error("Error accepting request!");
    }
  }

  async function rejectRequest(requestId) {
    try {
      const response = await instance.put(`/api/users/reject/${requestId}`, {
        senderID: userId,
      });

      if (response?.status === 200 && response?.data) {
        toast.success("Friend Request Rejected!", {
          position: "top-right",
          autoClose: 700,
        });

        setTimeout(() => {
          setFriendRequest((prev) =>
            prev.filter((user) => user.uniqueId !== requestId)
          );
        }, 1400);
      } else {
        toast.warn(`Unexpected response: ${response.status}`);
      }
    } catch (error) {
      toast.error("Failed to reject friend request!");
      console.error("Reject error:", error);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900">
        <div className="text-center py-20">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-400/20 rounded-full mx-auto mb-6"></div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-16 border-4 border-transparent border-t-purple-400 rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-300 text-lg">Loading Notifications...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="pl-[5%] pt-10 w-full min-h-screen bg-gradient-to-br from-blue-900 via-blue-900 to-indigo-900 text-white mt-10">
      <ToastContainer />

      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl">
          <Sparkles className="w-6   h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
            Notifications
          </h1>
          <p className="text-slate-400 mt-1">
            See who wants to connect with you
          </p>
        </div>
      </div>

      {/* 📬 Friend Requests */}
      {!loading && (
        <ul className="space-y-4 flex flex-wrap gap-4 mt-10">
          {friendRequest.map((profile) => (
            <div
              key={profile.uniqueId}
              className="w-[260px] h-[300px] rounded-xl shadow-md border border-gray-400 relative bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900"
            >
              <div className="h-[90px] rounded-t-xl relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-10 w-[80px] h-[80px] rounded-full bg-gray-200 border-3 border-white overflow-hidden">
                  <img
                    src={profile.profilePic || ProfileImg}
                    alt="profile"
                    className="w-full h-full object-cover "
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
                  onClick={() => acceptRequest(profile.uniqueId)}
                  className="text-[15px] border py-1.5 px-5 rounded-2xl cursor-pointer text-green-400 border-green-400 hover:bg-green-700 hover:text-white"
                >
                  Accept
                </button>
                <button
                  onClick={() => rejectRequest(profile.uniqueId)}
                  className="text-[15px] border py-1.5 px-5 rounded-2xl cursor-pointer text-red-400 border-red-400 hover:bg-red-700 hover:text-white"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </ul>
      )}

      {/* ✅ No Notifications */}
      {!loading && friendRequest.length === 0 && !error && (
        <div className="text-center py-20 mt-20">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mx-auto flex items-center justify-center">
              <Sparkles className="text-white w-10 h-10" />
            </div>
          </div>
          <h3 className="text-slate-300 text-xl font-medium mb-2">
            No Notifications found yet!
          </h3>
        </div>
      )}
    </div>
  );
}

export default Notifications;
