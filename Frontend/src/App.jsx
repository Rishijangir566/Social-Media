import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Profile from "./Profile";
import Layout from "./Layout";
import UserProvider from "./context/UserContext";
import GithubCallback from "./components/GithubCallback";
import GoogleCallback from "./components/GoogleCallback";
import LinkedinCallback from "./components/LinkedinCallback";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthProvider from "./context/AuthContext";
import Setting from "./pages/Setting";
import Connection from "./pages/Connection";
import Post from "./pages/Post";
import Message from "./pages/Message";
import Notifications from "./pages/Notifications";
import MainLayout from "./pages/MainLaout";

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
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/mainLayout",
        element: (
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        ),
      },
      {
        path: "/app/Message",
        element: (
          <ProtectedRoute>
            <Message />
          </ProtectedRoute>
        ),
      },
      {
        path: "/app/post",
        element: (
          <ProtectedRoute>
            <Post />
          </ProtectedRoute>
        ),
      },
      {
        path: "/app/connection",
        element: (
          <ProtectedRoute>
            <Connection />
          </ProtectedRoute>
        ),
      },
      {
        path: "/notifiction",
        element: (
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        ),
      },

      {
        path: "/app/setting",
        element: (
          <ProtectedRoute>
            <Setting />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
function App() {
  return (
    <>
      <AuthProvider>
        <UserProvider>
          <RouterProvider router={router} />
        </UserProvider>
      </AuthProvider>
    </>
  );
}

export default App;
