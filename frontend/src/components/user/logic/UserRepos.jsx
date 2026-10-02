import React, {
  useEffect,
  useState,
} from "react";
import {
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import "../styles/userRepos.css";

const UserRepos = ({
  repos,
  userId,
}) => {
  const navigate = useNavigate();

  const [starred, setStarred] =
    useState([]);

  const [loading, setLoading] =
    useState({});

  useEffect(() => {
    const getStarred = async () => {
      if (!userId) {
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/starred/${userId}`
        );

        setStarred(response.data);
      } catch (err) {
        console.error(
          "Cannot fetch starred repositories:",
          err
        );
      }
    };

    getStarred();
  }, [userId]);

  const starRepo = async (repoId) => {
    try {
      setLoading((prev) => ({
        ...prev,
        [repoId]: true,
      }));

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/star`,
        {
          userId,
          repositoryId: repoId,
        }
      );

      if (response.status === 200) {
        const repo = repos.find(
          (item) =>
            String(item._id) ===
            String(repoId)
        );

        if (repo) {
          setStarred((prev) => [
            ...prev,
            repo,
          ]);
        }
      }
    } catch (err) {
      console.error(
        "Error while starring repository:",
        err
      );
    } finally {
      setLoading((prev) => ({
        ...prev,
        [repoId]: false,
      }));
    }
  };

  const unstarRepo = async (repoId) => {
    try {
      setLoading((prev) => ({
        ...prev,
        [repoId]: true,
      }));

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/unstar`,
        {
          userId,
          repositoryId: repoId,
        }
      );

      if (response.status === 200) {
        setStarred((prev) =>
          prev.filter(
            (repo) =>
              String(repo._id) !==
              String(repoId)
          )
        );
      }
    } catch (err) {
      console.error(
        "Error while unstarring repository:",
        err
      );
    } finally {
      setLoading((prev) => ({
        ...prev,
        [repoId]: false,
      }));
    }
  };

  return (
    <div className="repo-section">
      <div className="repo-head">
        <p className="section-label">
          REPOSITORIES
        </p>

        <h2>Public Repositories</h2>

        <p>
          Repositories created by the user
        </p>
      </div>

      {repos.length > 0 ? (
        <div className="repo-list">
          {repos.map((repo) => {
            const isStarred =
              starred.some(
                (item) =>
                  String(item._id) ===
                  String(repo._id)
              );

            return (
              <div
                className="repo-card"
                key={repo._id}
              >
                <div
                  className="repo-content"
                  onClick={() =>
                    navigate(
                      `/repo/${repo._id}`
                    )
                  }
                >
                  <div className="repo-name">
                    <h3>{repo.name}</h3>

                    <span>Public</span>
                  </div>

                  <p>
                    {repo.description ||
                      "No description available"}
                  </p>
                </div>

                <button
                  className="repo-star"
                  onClick={() =>
                    isStarred
                      ? unstarRepo(repo._id)
                      : starRepo(repo._id)
                  }
                  disabled={
                    loading[repo._id]
                  }
                >
                  {isStarred
                    ? "★"
                    : "☆"}
                </button>

                <div className="repo-arrow">
                  →
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="no-repos">
          <p>
            This user doesn't have any public
            repositories yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default UserRepos;