import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../axiosConfig.js";
import { useAuth } from "../context/AuthContext.jsx";

const GoogleCallback = () => {
  const [user1, setUser1] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");

    if (!code) return;

    const redirectUri = `${window.location.origin}/google/callback`;

    const authenticateWithGoogle = async () => {
      try {
        const res = await instance.post(
          "user/google/callback",
          { code, redirectUri },
          { withCredentials: true }
        );

        console.log("Google response:", res);
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
        setUser1(false);
        console.error("Google login error:", err);
      }
    };

    authenticateWithGoogle();
  }, []);

  return (
    <>
      {!user1 ? (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-800">
          <div className="bg-blue-800/80 backdrop-blur-xl rounded-xl p-8 border border-blue-700/50 shadow-xl text-center text-white">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center animate-spin">
                <svg className="w-8 h-8 text-red-600" viewBox="0 0 48 48">
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.15 0 5.96 1.1 8.18 2.92l6.12-6.12C34.62 2.65 29.63.5 24 .5 14.8.5 6.93 6.28 3.82 14.29l7.7 5.99C13.02 14.01 18.07 9.5 24 9.5z"
                  />
                  <path
                    fill="#34A853"
                    d="M46.5 24.5c0-1.65-.14-3.24-.41-4.77H24v9.04h12.8c-.55 2.9-2.21 5.36-4.63 7.02l7.3 5.66C44.62 37.57 46.5 31.41 46.5 24.5z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M11.52 28.58A14.5 14.5 0 019.5 24c0-1.59.26-3.13.73-4.58l-7.7-5.99A23.85 23.85 0 000 24c0 3.91.94 7.6 2.6 10.87l8.92-6.29z"
                  />
                  <path
                    fill="#4285F4"
                    d="M24 48c6.48 0 11.92-2.13 15.9-5.8l-7.3-5.66c-2.1 1.42-4.78 2.26-8.6 2.26-5.93 0-10.98-4.51-12.48-10.49l-8.92 6.29C6.93 41.72 14.8 48 24 48z"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-4 text-white">
              Google Authentication
            </h1>
            <p className="text-gray-300 mb-6">
              Verifying your Google account...
            </p>
            <div className="w-64 mx-auto mb-4">
              <div className="h-2 bg-blue-700 rounded-full overflow-hidden">
                <div className="h-full bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="flex justify-center items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
              <span className="text-gray-300 text-sm">Processing...</span>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default GoogleCallback;
