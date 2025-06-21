import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Profile from "./Profile";
import Layout from "./Layout";
import UserProvider from "./context/UserContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
]);
function App() {
  return (
    <>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </>
  );
}

export default App;
