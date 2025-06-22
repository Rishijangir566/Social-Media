import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Profile from "./Profile";
import Layout from "./Layout";
import UserProvider from "./context/UserContext";
import GithubCallback from "./components/GithubCallback";
import GoogleCallback from "./components/GoogleCallback";
import LinkedinCallback from "./components/LinkedinCallback";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthProvider from "./context/AuthContext";

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
        path: "/homePage",

        element: (
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        ),
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
