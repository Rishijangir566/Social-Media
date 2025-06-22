import { useEffect, useState } from "react";
import instance from "../axiosConfig.js";
import { useLocation, useNavigate } from "react-router-dom";

const GithubCallback = () => {
  const [user, setUser] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
          setTimeout(() => {
            setUser(true);
            navigate("/profile");
          }, 1000);
          setUser(true);
        }
      } catch (err) {
        setUser(false);
        console.error("GitHub login error:", err);
      }
    };

    handleGitHubCallback();
  }, [location.search]);

  return (
    <>
      {!user ? (
        <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
          <p>Just a moment, verifying your Github account...</p>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default GithubCallback;
