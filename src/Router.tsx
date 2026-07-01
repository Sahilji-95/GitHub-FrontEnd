import { useNavigate, useRoutes } from "react-router-dom";

import Dashboard from "./components/dashboard/Dashboard";
import Login from "./components/auth/Login";
import Singup from "./components/auth/Signup";
import Profile from "./components/user/Profile";
import FollowedUsers from "./components/user/FollowedUsers";
import StaredRepo from "./components/user/StaredRepo";
import RepoDetails from "./components/repo/RepoDetails";
import UserProfile from "./components/user/UsersProfile";

import { useAuth } from "./authContext";
import { useEffect } from "react";

const Routes = () => {
  const { currUser, setCurrUser } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem("userId");
    if (userIdFromStorage && !currUser) {
      setCurrUser(userIdFromStorage);
    }

    if (
      !userIdFromStorage &&
      !["/login", "/signup"].includes(window.location.pathname)
    ) {
      {
        navigate("/login");
      }
    }

    if (userIdFromStorage && window.location.pathname == "/login") {
      navigate("/");
    }
  }, [currUser, navigate, setCurrUser]);

  let element = useRoutes([
    {
      path: "/",
      element: <Dashboard />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Singup />,
    },
    {
      path: "/profile",
      element: <Profile />,
    },
    {
      path: "/staredRepo",
      element: <StaredRepo />,
    },
    {
      path: "/followedUsers",
      element: <FollowedUsers />,
    },
    {
      path: "/repo/id/:repoId",
      element: <RepoDetails />,
    },
    {
      path: "/userProfile/:userId",
      element: <UserProfile />,
    },
  ]);

  return element;
};

export default Routes;
