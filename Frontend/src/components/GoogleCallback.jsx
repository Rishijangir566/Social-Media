import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../axiosConfig.js";

const GoogleCallback = () => {
  const [user, setUser] = useState(false);
  const navigate = useNavigate();

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
            navigate("/homePage");
          } else {
            setTimeout(() => {
              setUser(true);
              navigate("/profile");
            }, 1000);
          }
        }
      } catch (err) {
        setUser(false);
        console.error("Google login error:", err);
      }
    };

    authenticateWithGoogle();
  }, []);

  return (
    <>
      {!user ? (
        <div className="min-h-screen flex justify-center items-center bg-blue-400 text-white">
          <p>Just a moment, verifying your Google account...</p>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default GoogleCallback;
