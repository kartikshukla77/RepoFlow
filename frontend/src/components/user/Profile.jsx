import React, { useEffect, useState } from "react";
import {
  useLocation,
  useParams,
} from "react-router-dom";
import axios from "axios";
import "./styles/profile.css";
import Navbar from "../navbar/Navbar";

import ProfileNav from "./logic/ProfileNav";
import UserInfo from "./logic/UserInfo";
import FollowInfo from "./logic/FollowInfo";
import Contributions from "./logic/Contributions";
import UserRepos from "./logic/UserRepos";
import StarredRepos from "./logic/StarredRepos";

const Profile = () => {
  const location = useLocation();
  const { id } = useParams();

  const [user, setUser] = useState({
    username: "username",
    followers: [],
    followedUsers: [],
    repositories: [],
  });

  const [error, setError] = useState("");

  const currentUserId =
    localStorage.getItem("userId");

  const profileUserId =
    id || currentUserId;

  const isOwnProfile =
    String(profileUserId) ===
    String(currentUserId);

  const isStarredPage =
    location.pathname === "/profile/starred";

  useEffect(() => {
    const getUser = async () => {
      if (!profileUserId) {
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/userProfile/${profileUserId}`
        );

        setUser(response.data);
        setError("");
      } catch (err) {
        console.error(
          "Cannot fetch user details:",
          err
        );

        setError(
          "Cannot fetch user profile!"
        );
      }
    };

    getUser();
  }, [profileUserId]);

  return (
    <>
      <Navbar />

      {isOwnProfile && <ProfileNav />}

      {isStarredPage && isOwnProfile ? (
        <div className="profile-page">
          <div className="profile-box">
            <div className="profile-top">
              <UserInfo
                username={user.username}
              />

              <FollowInfo
                userId={currentUserId}
                targetId={profileUserId}
                isOwn={isOwnProfile}
                followers={user.followers}
                following={user.followedUsers}
                error={error}
              />
            </div>

            <div className="profile-divider"></div>

            <div className="profile-bottom">
              <div className="contribution-box">
                <Contributions />
              </div>

              <div className="profile-divider"></div>

              <div className="repository-box">
                <StarredRepos />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="profile-page">
          <div className="profile-box">
            <div className="profile-top">
              <UserInfo
                username={user.username}
              />

              <FollowInfo
                userId={currentUserId}
                targetId={profileUserId}
                isOwn={isOwnProfile}
                followers={user.followers}
                following={user.followedUsers}
                error={error}
              />
            </div>

            <div className="profile-divider"></div>

            <div className="profile-bottom">
              <div className="contribution-box">
                <Contributions />
              </div>

              <div className="profile-divider"></div>

              <div className="repository-box">
                <UserRepos
                  repos={user.repositories || []}
                  userId={currentUserId}
                  username={user.username}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;