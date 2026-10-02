import React from "react";
import profileImage from "../../../assets/profile.png";
import "../styles/userInfo.css";

const UserInfo = ({ username }) => {
  return (
    <div className="user-info">
      <img
        className="profile-img"
        src={profileImage}
        alt="Profile"
      />

      <div className="name">
        <h3>{username}</h3>
      </div>
    </div>
  );
};

export default UserInfo;