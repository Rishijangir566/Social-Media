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

import Notifications from "./pages/Notifications";
import MainLayout from "./pages/MainLaout";
import HomePage from "./HomePage";
import DisplayPosts from "./DisplayPosts";
import MyNetwork from "./pages/MyNetwork";
import MyPosts from "./pages/MyPosts";
import ChatRoom from "./pages/ChatRoom";

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
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "github-callback",
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
    ],
  },

  {
    path: "/app",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "Home",
        element: <HomePage />,
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "network",
        element: (
          <ProtectedRoute>
            <MyNetwork />,
          </ProtectedRoute>
        ),
      },
      {
        path: "displayPosts",
        element: <DisplayPosts />,
      },
      {
        path: "post",
        element: <Post />,
      },
      {
        path: "connection",
        element: <Connection />,
      },
      {
        path: "notification",
        element: <Notifications />,
      },
      {
        path: "setting",
        element: <Setting />,
      },
      {
        path: "my-posts",
        element: <MyPosts />,
      },
      {
        path: "chat/:receiverId",
        element: <ChatRoom />,
      },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        {/* <EditorProvider> */}
        <RouterProvider router={router} />
        {/* </EditorProvider> */}
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
