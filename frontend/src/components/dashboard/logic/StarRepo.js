import { useEffect, useState } from "react";

const StarRepo = (repos, allSuggestedRepos) => {
  const [starredRepos, setStarredRepos] = useState([]);
  const [starLoading, setStarLoading] = useState({});

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchStarredRepos = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/starred/${userId}`
        );

        const data = await response.json();

        if (response.ok) {
          setStarredRepos(data || []);
        }
      } catch (err) {
        console.log("Error while fetching starred repositories:", err);
      }
    };

    fetchStarredRepos();
  }, []);

  const isRepoStarred = (repoId) => {
    return starredRepos.some(
      (repo) => String(repo._id) === String(repoId)
    );
  };

  const handleStar = async (repoId) => {
    const userId = localStorage.getItem("userId");

    try {
      setStarLoading((prev) => ({
        ...prev,
        [repoId]: true,
      }));

      const response = await fetch(`${import.meta.env.VITE_API_URL}/star`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          repositoryId: repoId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("Error while starring repository:", data.message);
        return;
      }

      const repo =
        allSuggestedRepos.find(
          (item) => String(item._id) === String(repoId)
        ) ||
        repos.find(
          (item) => String(item._id) === String(repoId)
        );

      if (repo) {
        setStarredRepos((prev) => [...prev, repo]);
      }
    } catch (err) {
      console.log("Error while starring repository:", err);
    } finally {
      setStarLoading((prev) => ({
        ...prev,
        [repoId]: false,
      }));
    }
  };

  const handleUnstar = async (repoId) => {
    const userId = localStorage.getItem("userId");

    try {
      setStarLoading((prev) => ({
        ...prev,
        [repoId]: true,
      }));

      const response = await fetch(`${import.meta.env.VITE_API_URL}/unstar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          repositoryId: repoId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("Error while unstarring repository:", data.message);
        return;
      }

      setStarredRepos((prev) =>
        prev.filter(
          (repo) => String(repo._id) !== String(repoId)
        )
      );
    } catch (err) {
      console.log("Error while unstarring repository:", err);
    } finally {
      setStarLoading((prev) => ({
        ...prev,
        [repoId]: false,
      }));
    }
  };

  const handleStarClick = (e, repoId) => {
    e.stopPropagation();

    if (isRepoStarred(repoId)) {
      handleUnstar(repoId);
    } else {
      handleStar(repoId);
    }
  };

  return {
    starredRepos,
    starLoading,
    isRepoStarred,
    handleStarClick,
  };
};

export default StarRepo;