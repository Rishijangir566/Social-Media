import { useEffect, useState } from "react";
import instance from "../axiosConfig";
import { toast, ToastContainer } from "react-toastify";
import { Sparkles, MessageCircle, UserX, Network } from "lucide-react";
import { Link } from "react-router-dom";

function MyNetwork() {
  const [userConnection, setUserConnection] = useState([]);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState("");
  const [check, setCheck] = useState(false);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    fetchUserAndProfiles();
  }, [check]);

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
      if (response?.data?.connections) {
        await fetchRequestDetail(response?.data?.connections);
      }
    } catch (error) {
      console.error("Error fetching friend data:", error);
    }
  }

  async function fetchRequestDetail(connectionArray) {
    try {
      const promises = connectionArray.map((id) =>
        instance.get(`/api/users/all-request/${id}`)
      );
      const responses = await Promise.all(promises);
      const connectionData = responses.map((res) => res.data);
      setUserConnection(connectionData);
    } catch (error) {
      console.error("Error fetching request details:", error);
      setError("Failed to fetch request details.");
    }
  }

  async function handleRemoveConnection(requestId) {
    try {
      const response = await instance.put(
        `/api/users/remove/connection/${requestId}`,
        {
          senderID: userId,
        }
      );
      if (response?.status === 200 && response?.data) {
        toast.success("Friend Removed!", {
          position: "top-right",
          autoClose: 2000,
        });
        setCheck((prev) => !prev);
      } else {
        toast.warn(`Unexpected response: ${response.status}`);
      }
    } catch (error) {
      toast.error("Failed to remove connection!");
      console.error("Remove error:", error);
    }
  }

 
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900">
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-white text-lg font-medium">
            Loading your connections...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-900 via-blue-900 to-indigo-900 text-white mt-10">
      <ToastContainer />

      {/* Header Section */}
      <div className="pt-15 pb-12 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <Network className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                My Network
              </h1>
              <p className="text-slate-400 mt-2">
                Manage your connections and build your network
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Connection Cards */}
      <div className="px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {userConnection?.map((profile) => (
              <div
                key={profile.uniqueId}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 hover:border-blue-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20"
              >
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-2xl"></div>
                </div>

                <div className="relative p-6">
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 ring-opacity-50 p-1">
                        <div className="w-full h-full rounded-full overflow-hidden bg-white">
                          <img
                            src={profile.profilePic}
                            alt="profile"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center mb-6">
                    <h3 className="font-semibold text-white text-lg mb-1">
                      {profile.userName || profile.name}
                    </h3>
                    <p className="text-slate-400 text-sm">{profile.email}</p>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25">
                      <MessageCircle className="w-4 h-4" />
                      Chat
                    </button>
                    <button
                      onClick={() => handleRemoveConnection(profile.uniqueId)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25"
                    >
                      <UserX className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Empty State */}
      {userConnection.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center py-20 px-8">
          <div className="relative mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10">
              <Sparkles className="text-blue-400 w-16 h-16" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">0</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">
            No Connections Yet
          </h3>
          <p className="text-slate-400 text-center max-w-md leading-relaxed">
            Start building your network by connecting with colleagues, friends,
            and industry professionals.
          </p>
          <div className="mt-8 flex gap-4">
            <Link to="/app/Home">
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 cursor-pointer">
                Discover People
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyNetwork;
