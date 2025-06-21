import { createContext, useContext, useState } from "react";
const UserContext = createContext();

function UserProvider({ children }) {
  const [userDetail, setUserDetail] = useState(null);

  const [message, setMessage] = useState({ type: "", text: "" });

  function showMessage(type, text) {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 1500);
  }

  return (
    <UserContext.Provider
      value={{
        userDetail,
        setUserDetail,
        message,
        setMessage,
        showMessage,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  return useContext(UserContext);
}

export default UserProvider;
