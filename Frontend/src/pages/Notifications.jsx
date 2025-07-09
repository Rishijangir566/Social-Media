import { useEffect, useState } from "react";
import instance from "../axiosConfig";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

function Notifications({ userData, availableUser, setUserData }) {
  // const navigate = useNavigate();
  const [senders, setSenders] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [userId, setUserId] = useState(null);
  const [friendRequest, setFriendRequest] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUserAndProfiles();
  }, []);
  async function fetchUserAndProfiles() {
    try {
      const userRes = await instance.get("/api/users/me");
      const mainUser = userRes.data;
      setUserId(mainUser.uniqueId);

      await fetchFriendData(mainUser.uniqueId);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch profiles.");
    }
  }
  async function fetchFriendData(userId) {
    try {
      const response = await instance.get(`/api/users/request/${userId}`);

      fetchRequestDetail(response?.data?.receivedRequests);
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
      setFriendRequest(requestData);
    } catch (error) {
      console.error("Error fetching request details:", error);
      setError("Failed to fetch request details.");
    }
  }

  console.log(friendRequest);

  // async function acceptRequest(requestId) {
  //   try {
  //     const response = await instance.put(`/api/users/accept/${requestId}`);
  //  console.log("hello3")
  //     if (response?.status === 200 && response?.data) {
  //       toast.success("Friend Request Accepted!", { position: "top-right", autoClose: 3000 });

  //       setUserData((prev) => ({
  //         ...prev,
  //         receivedRequest: prev.receivedRequest.filter(id => id !== requestId),
  //       }));

  //       setSenders(prev => prev.filter(sender => sender.friendRequestId !== requestId));

  //       setTimeout(() => navigate("/"), 2000);
  //     } else {
  //       toast.warn(`Unexpected response: ${response.status}`);
  //     }

  //   } catch (error) {
  //     toast.error("Error accepting request!");
  //     console.error("Accept error:", error);
  //   }
  // }

  // async function rejectRequest(requestId) {
  //   try {
  //     const response = await instance.put(`/api/users/reject/${requestId}`);
  //            console.log("hello")
  //     if (response?.status === 200 && response?.data) {
  //       toast.success("Friend Request Rejected!", { position: "top-right", autoClose: 3000 });

  //       setUserData((prev) => ({
  //         ...prev,
  //         receivedRequest: prev.receivedRequest.filter(id => id !== requestId),
  //       }));

  //       setSenders(prev => prev.filter(sender => sender.friendRequestId !== requestId));

  //       setTimeout(() => navigate("/"), 2000);
  //     } else {
  //       toast.warn(`Unexpected response: ${response.status}`);
  //     }

  //   } catch (error) {
  //     toast.error("Failed to reject friend request!");
  //     console.error("Reject error:", error);
  //   }
  // }

  return (
    <div className="pl-[5%] pt-10 w-full min-h-screen bg-gradient-to-br from-blue-900 via-blue-900 to-indigo-900 text-white mt-10">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">Connection Request</h1>

      <ul className="space-y-4 flex flex-wrap gap-4 mt-10">
        {friendRequest.map((profile, index) => {
          const requestId = profile._id || profile.requestId; // adjust if your backend uses a different field
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
                  onClick={() => acceptRequest(requestId)}
                  className="text-[15px] border py-1.5 px-5 rounded-2xl cursor-pointer text-green-400 border-green-400 hover:bg-green-700 hover:text-white"
                >
                  Accept
                </button>
                <button
                  onClick={() => rejectRequest(requestId)}
                  className="text-[15px] border py-1.5 px-5 rounded-2xl cursor-pointer text-red-400 border-red-400 hover:bg-red-700 hover:text-white"
                >
                  Reject
                </button>
              </div>
            </div>
          );
        })}
      </ul>
      {friendRequest.length === 0 && !error && (
        <div className="text-center py-20 mt-20">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mx-auto flex items-center justify-center">
              <Sparkles className="text-white w-10 h-10" />
            </div>
          </div>
          <h3 className="text-slate-300 text-xl font-medium mb-2">
            No Notifications found yet!
          </h3>
          {/* <p className="text-slate-400">
            No one except you has logged in with this application.
          </p> */}
        </div>
      )}
    </div>
  );
}

export default Notifications;
