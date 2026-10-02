const User = require("../../models/userModel");
const Repository = require("../../models/repoModel");

async function starRepository(req, res) {
  const { userId, repositoryId } = req.body;

  try {
    if (!userId || !repositoryId) {
      return res.status(400).json({
        message: "User ID and repository ID are required!",
      });
    }

    const user = await User.findById(userId);
    const repository = await Repository.findById(repositoryId);

    if (!user || !repository) {
      return res.status(404).json({
        message: "User or repository not found!",
      });
    }

    await User.findByIdAndUpdate(userId, {
      $addToSet: {
        starRepos: repositoryId,
      },
    });

    res.json({
      message: "Repository starred successfully!",
    });
  } catch (err) {
    console.error("Error while starring repository:", err.message);
    res.status(500).send("Server error!");
  }
}


async function unstarRepository(req, res) {
  const { userId, repositoryId } = req.body;

  try {
    if (!userId || !repositoryId) {
      return res.status(400).json({
        message: "User ID and repository ID are required!",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found!",
      });
    }

    await User.findByIdAndUpdate(userId, {
      $pull: {
        starRepos: repositoryId,
      },
    });

    res.json({
      message: "Repository unstarred successfully!",
    });
  } catch (err) {
    console.error("Error while unstarring repository:", err.message);
    res.status(500).send("Server error!");
  }
}


async function getStarredRepositories(req, res) {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found!",
      });
    }

    const starRepos = user.starRepos || [];

    const repositories = await Repository.find({
      _id: {
        $in: starRepos,
      },
      visibility: true,
    }).populate("owner");

    res.json(repositories);
  } catch (err) {
    console.error("Error while fetching starred repositories:",err.message);
    res.status(500).send("Server error!");
  }
}

module.exports = {
  starRepository,
  unstarRepository,
  getStarredRepositories,
};