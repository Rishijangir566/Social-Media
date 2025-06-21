import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../axiosConfig";

const LinkedinCallback = () => {
    const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
//    console.log(code);
   
    if (!code) return;

    const redirectUri = `${window.location.origin}/linkedin/callback`;
    // console.log(redirectUri);
  
    const authenticateWithLinkedIn = async () => {
      try {
        const res = await instance.post(
          "user/linkedin/callback",
          { code, redirectUri },
          { withCredentials: true }
        );

        console.log("LinkedIn response:", res.data);
        setUser(res.data.user?.localizedFirstName || "LinkedIn User");
      } catch (err) {
        console.error("LinkedIn login error:", err);
      }
    };

    authenticateWithLinkedIn();
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
        <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
          <p>Completing LinkedIn login...</p>
        </div>
      )}
    </>
  );
};

export default LinkedinCallback;