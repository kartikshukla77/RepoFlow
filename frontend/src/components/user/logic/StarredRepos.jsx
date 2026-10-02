import React, {
  useEffect,
  useState,
} from "react";
import {
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import "../styles/starredRepos.css";

const StarredRepos = () => {
  const navigate = useNavigate();

  const [repos, setRepos] =
    useState([]);

  const [error, setError] =
    useState("");

  const userId =
    localStorage.getItem("userId");

  useEffect(() => {
    const getStarred = async () => {
      if (!userId) {
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/starred/${userId}`
        );

        setRepos(response.data);
      } catch (err) {
        console.error(
          "Cannot fetch starred repositories:",
          err
        );

        setError(
          "Cannot fetch starred repositories!"
        );
      }
    };

    getStarred();
  }, [userId]);

  return (
    <div className="repo-section starred">
      <div className="repo-head">
        <p className="section-label">
          STARRED
        </p>

        <h2>Starred Repositories</h2>

        <p>
          Repositories you have starred
        </p>
      </div>

      {error && (
        <p className="profile-error">
          {error}
        </p>
      )}

      {repos.length > 0 ? (
        <div className="repo-list">
          {repos.map((repo) => (
            <div
              className="repo-card"
              key={repo._id}
              onClick={() =>
                navigate(
                  `/repo/${repo._id}`
                )
              }
            >
              <div className="repo-content">
                <div className="repo-name">
                  <h3>{repo.name}</h3>

                  <span>Public</span>
                </div>

                <p>
                  {repo.description ||
                    "No description available"}
                </p>

                <p className="repo-owner">
                  Owned by{" "}
                  {repo.owner?.username ||
                    "Unknown user"}
                </p>
              </div>

              <div className="repo-arrow">
                →
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-repos">
          <p>
            You haven't starred any
            repositories yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default StarredRepos;