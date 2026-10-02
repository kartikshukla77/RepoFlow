import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import YourCard from "./YourCard.jsx";
import StarRepo from "./StarRepo.js";
import "../styles/yourRepo.css";

const YourRepo = () => {
  const navigate = useNavigate();

  const [repos, setRepos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [allSuggestedRepos, setAllSuggestedRepos] = useState([]);

  const {starredRepos,starLoading, isRepoStarred, handleStarClick,} = StarRepo(repos, allSuggestedRepos);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchRepos = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/repo/user/${userId}`
        );

        const data = await response.json();

        setRepos(data.repositories || []);
      } catch (err) {
        console.log("Error while fetching repositories:", err);
      }
    };

    const fetchSuggestedRepos = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/repo/all?userID=${userId}`
        );

        const data = await response.json();

        setAllSuggestedRepos(data || []);
      } catch (err) {
        console.log(
          "Error while fetching suggested repositories:",
          err
        );
      }
    };

    fetchRepos();
    fetchSuggestedRepos();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setSearchResults(repos);
    } else {
      const filteredRepos = repos.filter((repo) =>
        repo.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );

      setSearchResults(filteredRepos);
    }
  }, [searchQuery, repos]);

  return (
    <main className="repositories-section">
      <div className="section-header">
        <div>
          <p className="section-label">YOUR REPOSITORIES</p>

          <h2>Your Projects</h2>
        </div>
      </div>

      <div id="search">
        <input
          type="text"
          value={searchQuery}
          placeholder="Search repositories..."
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="repository-list">
        {searchResults.map((repo) => (
          <YourCard
            key={repo._id}
            repo={repo}
            isStarred={isRepoStarred(repo._id)}
            starLoading={starLoading}
            handleStarClick={handleStarClick}
            onClick={() => navigate(`/repo/${repo._id}`)}
          />
        ))}
      </div>
    </main>
  );
};

export default YourRepo;