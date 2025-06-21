import { useEffect, useState } from "react";
import instance from "../axiosConfig.js"
import { useLocation, useNavigate } from "react-router-dom";

const GithubCallback = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => { 
    const handleGitHubCallback = async () => {
      const code = new URLSearchParams(location.search).get("code");

      try {
        const redirectUri = `${window.location.origin}/github-callback`;

        const res = await instance.post(
          "/github/callback",
          {
            code,
            redirectUri,
          },
          { withCredentials: true }
        );

        console.log("GitHub response:", res.data);
        setUser(res.data.githubUser.login);
      } catch (err) {
        console.error("GitHub login error:", err);
      }
    };

    handleGitHubCallback();
  }, [location.search]);

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  return (
    <>
      {user ? (
        <div>
          <h2>Welcome, {user || "GitHub User"}!</h2>
          <div className="relative inline-block rounded-md p-[2px] bg-gradient-to-r from-purple-900 to-purple-800">
            <button
              onClick={handleLogout}
              className="text-white px-5 py-1 rounded-md bg-black w-full h-full"
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
          <p>Completing GitHub login...</p>
        </div>
      )}
    </>
  );
};

export default GithubCallback;