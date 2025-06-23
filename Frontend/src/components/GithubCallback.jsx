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
            navigate("/mainLayout");
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
      {!user1 ? (
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
