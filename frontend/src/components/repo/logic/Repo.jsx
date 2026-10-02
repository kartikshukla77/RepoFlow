import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../navbar/Navbar";
import "../styles/repo.css";

const Repo = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [repository, setRepository] = useState(null);
  const [error, setError] = useState("");

  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchRepository = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/repo/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          setError(
            data.error || "Failed to fetch repository!"
          );
          return;
        }

        if (data) {
          setRepository(data);
        } else {
          setError("Repository not found!");
        }
      } catch (err) {
        console.log(
          "Error while fetching repository:",
          err
        );

        setError(
          "Something went wrong while fetching repository!"
        );
      }
    };

    fetchRepository();
  }, [id]);

  const ownerId =
    repository?.owner?._id || repository?.owner;

  const isOwner =
    repository &&
    ownerId &&
    String(ownerId) === String(currentUserId);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this repository?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/repo/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: currentUserId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error || "Failed to delete repository!"
        );
        return;
      }

      navigate("/");
    } catch (err) {
      console.log(
        "Error while deleting repository:",
        err
      );

      setError("Something went wrong!");
    }
  };

  if (!repository) {
    return (
      <>
        <Navbar />

        <div className="repo-page">
          <div className="repo-card">
            <p>
              {error || "Loading repository..."}
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="repo-page">
        <div className="repo-card">
          <div className="repo-top">
            <div>
              <h1>{repository.name}</h1>

              <p className="repo-description">
               <b> {repository.description ||
                  "No description available"}</b> 
              </p>
            </div>

            <p className="repo-visibility">
              {repository.visibility
                ? "Public"
                : "Private"}
            </p>
          </div>

          <div className="repo-details">
            <div className="detail-card owner-detail-card">
              <p className="detail-label">
                OWNER
              </p>

              <div className="repo-owner">
                <div className="repo-owner-info">
                  <div className="repo-owner-avatar">
                    {repository.owner?.username
                      ?.charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <h3>
                      {repository.owner?.username ||
                        "Repository Owner"}
                    </h3>

                    <button
                      className="view-profile-btn"
                      onClick={() =>
                        navigate(
                          `/profile/${ownerId}`
                        )
                      }
                    >
                      View Profile 
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isOwner && (
            <div className="repo-actions">
              <button
                onClick={() =>
                  navigate(
                    `/repo/edit/${repository._id}`
                  )
                }
              >
                Edit Repository
              </button>

              <button onClick={handleDelete}>
                Delete Repository
              </button>
            </div>
          )}

          {error && (
            <p className="repo-error">
              {error}
            </p>
          )}

          <div className="content-card">
            <h2>Technologies Used</h2>

            {repository.content &&
            repository.content.length > 0 ? (
              <ul>
                {repository.content.map(
                  (item, index) => (
                    <li key={index}>
                      {item}
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p className="no-content">
                No content available.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Repo;