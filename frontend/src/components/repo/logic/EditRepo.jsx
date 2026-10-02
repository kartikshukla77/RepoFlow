import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../navbar/Navbar";
import "../styles/editRepo.css";

const EditRepo = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState(true);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchRepository = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/repo/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Failed to fetch repository!");
          return;
        }

        if (!data) {
          setError("Repository not found!");
          return;
        }

        const repository = data;

        if (
          !repository.owner ||
          String(repository.owner._id) !== String(currentUserId)
        ) {
          setError("You can only edit your own repository!");
          return;
        }

        setName(repository.name);
        setDescription(repository.description || "");
        setVisibility(repository.visibility);
      } catch (err) {
        console.log("Error while fetching repository:", err);
        setError("Something went wrong!");
      } finally {
        setLoading(false);
      }
    };

    fetchRepository();
  }, [id, currentUserId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Repository name is required!");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/repo/update/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: currentUserId,
            name: name.trim(),
            description: description.trim(),
            visibility,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to update repository!");
        return;
      }

      navigate(`/repo/${id}`);
    } catch (err) {
      console.log("Error while updating repository:", err);
      setError("Something went wrong!");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="edit-repo-page">
          <div className="edit-repo-card">
            <p>Loading repository...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="edit-repo-page">
        <div className="edit-repo-card">
          <p className="repo-label">EDIT REPOSITORY</p>

          <h1>Edit Repository</h1>

          {error ? (
            <div>
              <p className="edit-error">{error}</p>

              <button
                className="back-button"
                onClick={() => navigate(`/repo/${id}`)}
              >
                Back to Repository
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="edit-form-group">
                <label htmlFor="repo-name">
                  Repository name
                </label>

                <input
                  id="repo-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="edit-form-group">
                <label htmlFor="repo-description">
                  Description
                </label>

                <textarea
                  id="repo-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="edit-visibility">
                <h3>Visibility</h3>

                <label>
                  <input
                    type="radio"
                    name="visibility"
                    checked={visibility === true}
                    onChange={() => setVisibility(true)}
                  />
                  Public
                </label>

                <label>
                  <input
                    type="radio"
                    name="visibility"
                    checked={visibility === false}
                    onChange={() => setVisibility(false)}
                  />
                  Private
                </label>
              </div>

              <div className="edit-actions">
                <button
                  type="button"
                  onClick={() => navigate(`/repo/${id}`)}
                >
                  Cancel
                </button>

                <button type="submit">
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default EditRepo;