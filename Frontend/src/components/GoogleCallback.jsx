import { useEffect, useState } from "react";
import { useNavigate,  } from "react-router-dom";
import instance from "../axiosConfig.js";

const GoogleCallback = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
//   const location = useLocation();

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");

    if (!code) return;

    const redirectUri = `${window.location.origin}/google/callback`;

    const authenticateWithGoogle = async () => {
      try {
        const res = await instance.post(
          "/google/callback",
          { code, redirectUri },
          { withCredentials: true }
        );

        console.log("Google response:", res.data);
        setUser(res.data.user?.name || "Google User");
      } catch (err) {
        console.error("Google login error:", err);
      }
    };

    authenticateWithGoogle();
  }, []);

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  return (
    <>
      {user ? (
        <div>
          <h2>Welcome, {user}!</h2>
          <div className="relative inline-block rounded-md p-[2px] bg-gradient-to-r from-red-500 to-yellow-500">
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
          <p>Completing Google login...</p>
        </div>
      )}
    </>
  );
};

export default GoogleCallback;