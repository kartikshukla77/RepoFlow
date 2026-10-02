import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import YourCard from "./YourCard.jsx";
import StarRepo from "./StarRepo.js";
import "../styles/suggRepo.css";

const SuggRepo = () => {
  const navigate = useNavigate();

  const [suggestedRepos, setSuggestedRepos] = useState([]);
  const [allSuggestedRepos, setAllSuggestedRepos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const {starredRepos, starLoading, isRepoStarred,handleStarClick,} = StarRepo([],allSuggestedRepos);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const fetchRepos = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/repo/all?userID=${userId}`
        );

        const data = await response.json();
        const allRepos = data || [];

        setAllSuggestedRepos(allRepos);
        setSuggestedRepos(allRepos.slice(0, 5));
        setSearchResults(allRepos.slice(0, 5));
      } catch (err) {
        console.log("Error while fetching suggested repositories:",err);
      }
    };

    fetchRepos();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setSearchResults(suggestedRepos);
    } else {
      const filteredRepos = allSuggestedRepos.filter((repo) =>
        repo.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );

      setSearchResults(filteredRepos);
    }
  }, [searchQuery, suggestedRepos, allSuggestedRepos]);

  return (
    <div className="sidebar-card">
      <div className="sidebar-heading">
        <p className="section-label">DISCOVER</p>

        <h3>Suggested Repositories</h3>

        <input
          type="text"
          placeholder="Search repositories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="suggested-list">
        {searchResults.map((repo) => (
          <div
            className="suggested-card"
            key={repo._id}
            onClick={() => navigate(`/repo/${repo._id}`)}
          >
            <div className="repo-icon small">📁</div>

            <div>
              <h4>{repo.name}</h4>

              <p>{repo.description}</p>
            </div>

            <button
              className="repo-star suggested-star"
              title={
                isRepoStarred(repo._id)
                  ? "Unstar repository"
                  : "Star repository"
              }
              disabled={starLoading[repo._id]}
              onClick={(e) => handleStarClick(e, repo._id)}
            >
              {isRepoStarred(repo._id) ? "★" : "☆"}
            </button>

            <span>→</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggRepo;