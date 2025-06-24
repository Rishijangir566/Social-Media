import { useEffect, useState } from "react";
import instance from "../axiosConfig.js";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const GithubCallback = () => {
  const [user1, setUser1] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();

  useEffect(() => {
    const handleGitHubCallback = async () => {
      const code = new URLSearchParams(location.search).get("code");

      try {
        const redirectUri = `${window.location.origin}/github-callback`;

        const res = await instance.post(
          "user/github/callback",
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
        setUser1(false);
        console.error("GitHub login error:", err);
      }
    };

    handleGitHubCallback();
  }, [location.search]);

  return (
    <>
      {/* {!user1 ? (
        <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
          <p>Just a moment, verifying your Github account...</p>
        </div>
      ) : (
        ""
      )} */}

      {!user1 ? (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
          <div className="bg-gray-800/80 backdrop-blur-xl rounded-xl p-8 border border-gray-700/50 shadow-xl text-center text-white">
            {/* GitHub Icon */}
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center animate-spin">
                <svg
                  className="w-8 h-8 text-black"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold mb-4 text-white">
              GitHub Authentication
            </h1>

            {/* Loading message */}
            <p className="text-gray-300 mb-6">
              Verifying your GitHub account...
            </p>

            {/* Progress bar */}
            <div className="w-64 mx-auto mb-4">
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Status */}
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

export default GithubCallback;
