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
        console.error("Google login error:", err);
      }
    };

    authenticateWithGoogle();
  }, []);

  return (
    <>
      {!user1 ? (
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
