import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../authContext";
import "../styles/profileNav.css";

const ProfileNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { setCurrentUser } = useAuth();

  const isStarred =
    location.pathname === "/profile/starred";

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    setCurrentUser(null);

    window.location.href = "/auth";
  };

  return (
    <div className="profile-nav">
      <div className="profile-links">
        <button
          className={!isStarred ? "active" : ""}
          onClick={() => navigate("/profile")}
        >
          Overview
        </button>

        <button
          className={isStarred ? "active" : ""}
          onClick={() =>
            navigate("/profile/starred")
          }
        >
          Starred Repositories
        </button>
      </div>

      <button
        className="logout"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
};

export default ProfileNav;