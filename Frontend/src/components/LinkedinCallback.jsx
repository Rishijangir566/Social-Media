import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import instance from "../axiosConfig";
import { useAuth } from "../context/AuthContext.jsx";

const LinkedinCallback = () => {
  const navigate = useNavigate();
  const [user1, setUser1] = useState(false);
  const { setUser } = useAuth();
  const location = useLocation();

  // useEffect(() => {
  //   const url = new URL(window.location.href);
  //   const code = url.searchParams.get("code");
  //   console.log("code:", code); // Add this

  //   if (!code) return;

  //   const authenticateWithLinkedIn = async () => {
  //     try {
  //       console.log("Sending code to backend"); // Add this
  //       const res = await instance.post(
  //         "user/linkedin/callback",
  //         { code },
  //         { withCredentials: true }
  //       );

  //       console.log("LinkedIn response:", res.data);
  //       setUser(res.data.user?.name || "LinkedIn User"); // changed field to match backend
  //     } catch (err) {
  //       console.error("LinkedIn login error:", err);
  //     }
  //   };

  //   authenticateWithLinkedIn();
  // }, []);

  useEffect(() => {
    const handleLinkedinCallback = async () => {
      const code = new URLSearchParams(location.search).get("code");

      if (!code) {
        // toast.error("No code found from Linkedin.");
        return;
      }

      try {
        const redirectUri = `${window.location.origin}/linkedin/callback`;

        const res = await instance.post(
          "/user/linkedin/callback",
          {
            code,
            redirectUri,
          },
          { withCredentials: true }
        );
        console.log(res);
        if (res.status === 201) {
          if (res.data?.user?.firstTimeSignIn === true) {
            setUser1(true);
            setUser(true);
            navigate("/app/Home");
          } else {
            setTimeout(() => {
              navigate("/profile");
              setUser(true);
            }, 1000);
          }
        }
      } catch (err) {
        console.error("Linkedin login error:", err);
        // toast.error("Linkedin login failed.");
      }
    };

    handleLinkedinCallback();
  }, [location.search]);

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  // return (
  //   <>
  //     {user1 ? (
  //       <div>
  //         <h2>Welcome, {user?.name || "LinkedIn User"}!</h2>

  //         <div className="relative inline-block rounded-md p-[2px] bg-gradient-to-r from-blue-600 to-purple-500">
  //           <button
  //             onClick={handleLogout}
  //             className="text-white px-5 py-1 rounded-md bg-black w-full h-full"
  //           >
  //             Logout
  //           </button>
  //         </div>
  //       </div>
  //     ) : (
  //       <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
  //         <p>Completing LinkedIn login...</p>
  //       </div>
  //     )}
  //   </>
  // );

  return (
    <>
      {user1 ? (
        <div>
          <h2>Welcome, {user1?.name || "LinkedIn User"}!</h2>

          <div className="relative inline-block rounded-md p-[2px] bg-gradient-to-r from-blue-600 to-purple-500">
            <button
              onClick={handleLogout}
              className="text-white px-5 py-1 rounded-md bg-black w-full h-full"
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-800">
          <div className="bg-blue-800/80 backdrop-blur-xl rounded-xl p-8 border border-blue-700/50 shadow-xl text-center text-white">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center animate-spin">
                <svg className="w-8 h-8 text-blue-600" viewBox="0 0 48 48">
                  <path
                    fill="#0A66C2"
                    d="M24 9.5c3.15 0 5.96 1.1 8.18 2.92l6.12-6.12C34.62 2.65 29.63.5 24 .5 14.8.5 6.93 6.28 3.82 14.29l7.7 5.99C13.02 14.01 18.07 9.5 24 9.5z"
                  />
                  <path
                    fill="#0A66C2"
                    d="M46.5 24.5c0-1.65-.14-3.24-.41-4.77H24v9.04h12.8c-.55 2.9-2.21 5.36-4.63 7.02l7.3 5.66C44.62 37.57 46.5 31.41 46.5 24.5z"
                  />
                  <path
                    fill="#0A66C2"
                    d="M11.52 28.58A14.5 14.5 0 019.5 24c0-1.59.26-3.13.73-4.58l-7.7-5.99A23.85 23.85 0 000 24c0 3.91.94 7.6 2.6 10.87l8.92-6.29z"
                  />
                  <path
                    fill="#0A66C2"
                    d="M24 48c6.48 0 11.92-2.13 15.9-5.8l-7.3-5.66c-2.1 1.42-4.78 2.26-8.6 2.26-5.93 0-10.98-4.51-12.48-10.49l-8.92 6.29C6.93 41.72 14.8 48 24 48z"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-4 text-white">
              LinkedIn Authentication
            </h1>
            <p className="text-gray-300 mb-6">
              Verifying your LinkedIn account...
            </p>
            <div className="w-64 mx-auto mb-4">
              <div className="h-2 bg-blue-700 rounded-full overflow-hidden">
                <div className="h-full bg-purple-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="flex justify-center items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
              <span className="text-gray-300 text-sm">Processing...</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LinkedinCallback;
