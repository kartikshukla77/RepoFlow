import React, {
  useEffect,
  useState,
} from "react";
import axios from "axios";
import "../styles/followInfo.css";

const FollowInfo = ({
  userId,
  targetId,
  isOwn,
  followers,
  following,
  error,
}) => {
  const [isFollowing, setIsFollowing] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [followError, setFollowError] =
    useState("");

  const [followersCount, setFollowersCount] =
    useState(followers?.length || 0);

  const followingCount =
    following?.length || 0;

  useEffect(() => {
    const checkFollow = () => {
      const list = followers || [];

      const found = list.some(
        (follower) =>
          String(follower) ===
            String(userId) ||
          String(follower?._id) ===
            String(userId)
      );

      setIsFollowing(found);
      setFollowersCount(list.length);
    };

    checkFollow();
  }, [followers, userId]);

  const follow = async () => {
    try {
      setLoading(true);
      setFollowError("");

      const response = await axios.post(
        "http://localhost:3000/follow",
        {
          userId,
          targetUserId: targetId,
        }
      );

      if (response.status === 200) {
        setIsFollowing(true);
        setFollowersCount(
          (prev) => prev + 1
        );
      }
    } catch (err) {
      console.error(
        "Error while following user:",
        err
      );

      setFollowError(
        err.response?.data?.message ||
          "Something went wrong while following user!"
      );
    } finally {
      setLoading(false);
    }
  };

  const unfollow = async () => {
    try {
      setLoading(true);
      setFollowError("");

      const response = await axios.post(
        "http://localhost:3000/unfollow",
        {
          userId,
          targetUserId: targetId,
        }
      );

      if (response.status === 200) {
        setIsFollowing(false);
        setFollowersCount(
          (prev) => Math.max(prev - 1, 0)
        );
      }
    } catch (err) {
      console.error(
        "Error while unfollowing user:",
        err
      );

      setFollowError(
        err.response?.data?.message ||
          "Something went wrong while unfollowing user!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="follow-info">
      {!isOwn && (
        <button
          className="follow-btn"
          onClick={
            isFollowing
              ? unfollow
              : follow
          }
          disabled={loading}
        >
          {loading
            ? "Loading..."
            : isFollowing
            ? "Unfollow"
            : "Follow"}
        </button>
      )}

      <div className="follower">
        <p>
          <b>
            {followersCount}{" "}
            {followersCount === 1
              ? "Follower"
              : "Followers"}
          </b>
        </p>

        <p>
          <b>
            {followingCount} Following
          </b>
        </p>
      </div>

      {(followError || error) && (
        <p className="profile-error">
          {followError || error}
        </p>
      )}
    </div>
  );
};

export default FollowInfo;