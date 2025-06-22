import { useEffect } from "react";
import { createContext, useContext, useState } from "react";
import instance from "../axiosConfig";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkToken();
  }, [user]);

  console.log(user);

  const checkToken = async () => {
    try {
      const res = await instance.get("/api/users/checkToken", {
        withCredentials: true,
      });
      console.log(res);

      if (res.status === 200) {
        setUser(true);
      } else {
        setUser(false);
      }
    } catch (error) {
      setUser(false);
      console.log("Check token error:", error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthProvider;
