import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Profile from "./Profile";
import Layout from "./Layout";
import UserProvider from "./context/UserContext";
import GithubCallback from "./components/GithubCallback";
import GoogleCallback from "./components/GoogleCallback";
import LinkedinCallback from "./components/LinkedinCallback";

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
        path: "/github-callback",
        element: <GithubCallback />,
      },
      {
        path: "google/callback",
        element: <GoogleCallback />,
      },
      {
        path: "linkedin/callback",
        element: <LinkedinCallback />,
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
