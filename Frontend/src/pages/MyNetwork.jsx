// import { useEffect, useState } from "react";
// import instance from "../axiosConfig";
// import { ToastContainer } from "react-toastify";
// import { Sparkles } from "lucide-react";

// function MyNetwork() {
//   const [userConnection, setUserConnection] = useState([]);
//   const [userId, setUserId] = useState(null);
//   const [error, setError] = useState("");
//   const [check, setCheck] = useState(false);
//   useEffect(() => {
//     fetchUserAndProfiles();
//   }, []);
//   async function fetchUserAndProfiles() {
//     try {
//       const userRes = await instance.get("/api/users/me");
//       const mainUser = userRes.data;
//       setUserId(mainUser.uniqueId);

//       await fetchFriendData(mainUser.uniqueId);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to fetch profiles.");
//     }
//   }
//   async function fetchFriendData(userId) {
//     try {
//       const response = await instance.get(`/api/users/request/${userId}`);
//       console.log(response);

//       fetchRequestDetail(response?.data?.connections);
//     } catch (error) {
//       console.error("Error fetching friend data:", error);
//     }
//   }

//   async function fetchRequestDetail(connectionArray) {
//     try {
//       const promises = connectionArray.map((id) =>
//         instance.get(`/api/users/all-request/${id}`)
//       );

//       const responses = await Promise.all(promises);

//       const connectionData = responses.map((res) => res.data);
//       console.log(connectionData);
//       setUserConnection(connectionData);
//     } catch (error) {
//       console.error("Error fetching request details:", error);
//       setError("Failed to fetch request details.");
//     }
//   }
//   return (
//     <div className="pl-[5%] pt-10 w-full min-h-screen bg-gradient-to-br from-blue-900 via-blue-900 to-indigo-900 text-white mt-10">
//       <ToastContainer />
//       <h1 className="text-2xl font-bold mb-4">My Connection</h1>

//       <ul className="space-y-4 flex flex-wrap gap-4 mt-10">
//         {userConnection.map((profile) => {
//           return (
//             <div
//               key={profile.uniqueId}
//               className="w-[260px] h-[300px] rounded-xl shadow-md border border-gray-400 relative bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900"
//             >
//               <div className="h-[90px] rounded-t-xl relative">
//                 <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-10 w-[80px] h-[80px] rounded-full bg-gray-200 border-3 border-white overflow-hidden">
//                   <img
//                     src={profile.profilePic || ProfileImg}
//                     alt="profile"
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//               </div>

//               <div className="pt-14 px-4 text-center">
//                 <p className="font-semibold text-white text-[16px]">
//                   {profile.userName || profile.name}
//                 </p>
//                 <p className="text-gray-400 text-sm mt-1">{profile.email}</p>
//               </div>

//               <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
//                 <button
//                   onClick={() => handleChat(profile.uniqueId)}
//                   className="text-[15px] border py-1.5 px-5 rounded-2xl cursor-pointer text-blue-400 border-blue-400 hover:bg-blue-700 hover:text-white"
//                 >
//                   Chat
//                 </button>
//                 <button
//                   onClick={() => handleRemoveConnection(profile.uniqueId)}
//                   className="text-[15px] border py-1.5 px-5 rounded-2xl cursor-pointer text-red-400 border-red-400 hover:bg-red-700 hover:text-white"
//                 >
//                   Remove
//                 </button>
//               </div>
//             </div>
//           );
//         })}
//       </ul>
//       {userConnection.length === 0 && !error && (
//         <div className="text-center py-20 mt-20">
//           <div className="mb-6">
//             <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mx-auto flex items-center justify-center">
//               <Sparkles className="text-white w-10 h-10" />
//             </div>
//           </div>
//           <h3 className="text-slate-300 text-xl font-medium mb-2">
//             No Notifications found yet!
//           </h3>
//           {/* <p className="text-slate-400">
//             No one except you has logged in with this application.
//           </p> */}
//         </div>
//       )}
//     </div>
//   );
// }

// export default MyNetwork;



import { useEffect, useState } from "react";
import instance from "../axiosConfig";
import { ToastContainer } from "react-toastify";
import { Sparkles, MessageCircle, UserX, Users, Network } from "lucide-react";

function MyNetwork() {
  const [userConnection, setUserConnection] = useState([]);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState("");
  const [check, setCheck] = useState(false);
  
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
      console.log(response);

      fetchRequestDetail(response?.data?.connections);
    } catch (error) {
      // console.log("Error fetching friend data:", error);
    }
  }

  async function fetchRequestDetail(connectionArray) {
    try {
      const promises = connectionArray.map((id) =>
        instance.get(`/api/users/all-request/${id}`)
      );

      const responses = await Promise.all(promises);

      const connectionData = responses.map((res) => res.data);
      console.log(connectionData);
      setUserConnection(connectionData);
    } catch (error) {
      console.error("Error fetching request details:", error);
      setError("Failed to fetch request details.");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <ToastContainer />
      
      {/* Header Section */}
      <div className="pt-20 pb-12 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <Network className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                My Network
              </h1>
              <p className="text-slate-400 mt-2">Manage your connections and build your network</p>
            </div>
          </div>
          
          {/* Stats Bar */}
          <div className="flex items-center gap-6 mt-8 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-slate-300">
                {userConnection.length} Connection{userConnection.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="w-px h-6 bg-white/20"></div>
            <div className="text-sm text-slate-400">
              Connection Requests
            </div>
          </div>
        </div>
      </div>

      {/* Connection Cards */}
      <div className="px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {userConnection.map((profile) => {
              return (
                <div
                  key={profile.uniqueId}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 hover:border-blue-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20"
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-2xl"></div>
                  </div>

                  {/* Card Content */}
                  <div className="relative p-6">
                    {/* Avatar Section */}
                    <div className="flex justify-center mb-6">
                      <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1">
                          <div className="w-full h-full rounded-full overflow-hidden bg-white">
                            <img
                              src={profile.profilePic || "https://via.placeholder.com/80x80/3B82F6/FFFFFF?text=U"}
                              alt="profile"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="text-center mb-6">
                      <h3 className="font-semibold text-white text-lg mb-1">
                        {profile.userName || profile.name}
                      </h3>
                      <p className="text-slate-400 text-sm">{profile.email}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleChat(profile.uniqueId)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
                      >
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
              );
            })}
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
            Start building your network by connecting with colleagues, friends, and industry professionals.
          </p>
          <div className="mt-8 flex gap-4">
            <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300">
              Discover People
            </button>
            <button className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-xl text-white font-medium border border-white/20 hover:bg-white/20 transition-all duration-300">
              Import Contacts
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyNetwork;