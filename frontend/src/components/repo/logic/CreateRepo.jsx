import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/createRepo.css";
import Navbar from "../../navbar/Navbar";

const CreateRepo = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const userId = localStorage.getItem("userId");

    if (!userId) {
      setError("User not logged in!");
      return;
    }

    if (!name.trim()) {
      setError("Repository name is required!");
      return;
    }

    try {
      setLoading(true);

      const repositoryContent = content
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== "");

      const response = await fetch(
        "http://localhost:3000/repo/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            owner: userId,
            name: name.trim(),
            description: description.trim(),
            visibility,
            content: repositoryContent,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error || "Failed to create repository!"
        );
        return;
      }

      console.log("Repository created:", data);

      navigate("/");
    } catch (err) {
      console.error(
        "Error while creating repository:",
        err
      );

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="create-repository-page">
        <div className="create-repository-card">
          <div className="create-repository-header">
            <p className="create-repository-label">
              NEW REPOSITORY
            </p>

            <h1>Create a repository</h1>

            <p>
              Create a new repository to start building
              and managing your project.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="repository-name">
                Repository name <span>*</span>
              </label>

              <input
                id="repository-name"
                type="text"
                value={name}
                placeholder="my-awesome-project"
                onChange={(e) =>
                  setName(e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="repository-description">
                Description
              </label>

              <textarea
                id="repository-description"
                value={description}
                placeholder="What is this repository about?"
                onChange={(e) =>
                  setDescription(e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="repository-content">
                Technologies used
              </label>

              <textarea
                id="repository-content"
                value={content}
                placeholder="Example: React, Node.js, Express.js, MongoDB"
                onChange={(e) =>
                  setContent(e.target.value)
                }
              />
            </div>

            <div className="visibility-section">
              <h3>Visibility</h3>

              <label className="visibility-option">
                <input
                  type="radio"
                  name="visibility"
                  checked={visibility === true}
                  onChange={() =>
                    setVisibility(true)
                  }
                />

                <div>
                  <strong>Public</strong>

                  <p>
                    Anyone can see this repository.
                  </p>
                </div>
              </label>

              <label className="visibility-option">
                <input
                  type="radio"
                  name="visibility"
                  checked={visibility === false}
                  onChange={() =>
                    setVisibility(false)
                  }
                />

                <div>
                  <strong>Private</strong>

                  <p>
                    Only you can see this repository.
                  </p>
                </div>
              </label>
            </div>

            {error && (
              <p className="repository-error">
                {error}
              </p>
            )}

            <div className="form-actions">
              <button
                type="button"
                className="cancel-repository-btn"
                onClick={() => navigate("/")}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="create-repository-btn"
                disabled={loading}
              >
                {loading
                  ? "Creating..."
                  : "Create repository"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateRepo;