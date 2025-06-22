import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  console.log(user);

  useEffect(() => {
    if (user === false) {
      navigate("/");
    }
  }, [user]);

  if (user === null) {
    return <div>Loading...</div>;
  }

  return user ? children : null;
}

export default ProtectedRoute;
