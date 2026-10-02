import React from "react";
import "../styles/yourCard.css";

const YourCard = ({repo,isStarred,starLoading,handleStarClick,onClick,}) => {
  return (
    <div
      className="repository-card"
      key={repo._id}
      onClick={onClick}
    >
      <div className="repo-icon">📁</div>

      <div className="repo-info">
        <h4>{repo.name}</h4>

        <p>{repo.description}</p>
      </div>

      <button
        className="repo-star"
        title={isStarred ? "Unstar repository" : "Star repository"}
        disabled={starLoading[repo._id]}
        onClick={(e) => handleStarClick(e, repo._id)}
      >
        {isStarred ? "★" : "☆"}
      </button>

      <div className="repo-arrow">→</div>
    </div>
  );
};

export default YourCard;