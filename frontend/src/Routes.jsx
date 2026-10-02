import React, { useEffect } from "react";
import { useNavigate, useRoutes } from "react-router-dom";

import Dashboard from "./components/dashboard/Dashboard";
import Profile from "./components/user/Profile";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import CreateRepo from "./components/repo/logic/CreateRepo";
import Repo from "./components/repo/logic/Repo";
import EditRepo from "./components/repo/logic/EditRepo";

import { useAuth } from "./authContext";

const ProjectRoutes = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const userIdFromStorage =
      localStorage.getItem("userId");

    if (userIdFromStorage && !currentUser) {
      setCurrentUser(userIdFromStorage);
    }

    if (
      !userIdFromStorage &&
      !["/login", "/signup"].includes(
        window.location.pathname
      )
    ) {
      navigate("/login");
    }

    if (
      userIdFromStorage &&
      window.location.pathname === "/login"
    ) {
      navigate("/");
    }
  }, [
    currentUser,
    navigate,
    setCurrentUser,
  ]);

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
      element: <Signup />,
    },

    {
      path: "/profile",
      element: <Profile />,
    },

    {
      path: "/profile/starred",
      element: <Profile />,
    },

    {
      path: "/profile/:id",
      element: <Profile />,
    },

    {
      path: "/repo/create",
      element: <CreateRepo />,
    },

    {
      path: "/repo/edit/:id",
      element: <EditRepo />,
    },

    {
      path: "/repo/:id",
      element: <Repo />,
    },
  ]);

  return element;
};

export default ProjectRoutes;