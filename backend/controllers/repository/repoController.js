const mongoose = require("mongoose");
const Repository = require("../../models/repoModel");
const User = require("../../models/userModel");

async function createRepository(req, res) {
  const { owner, name, content, description, visibility } = req.body;
  try {
    if (!name) {
      return res.status(400).json({
        error: "Repository name is required!",
      });
    }
    if (!mongoose.Types.ObjectId.isValid(owner)) {
      return res.status(400).json({
        error: "Invalid User ID!",
      });
    }

    const newRepository = new Repository({
      name,
      description,
      visibility,
      owner,
      content,
    });

    const result = await newRepository.save();

    res.status(201).json({
      message: "Repository created!",
      repositoryID: result._id,
    });
  } catch (err) {
    console.error("Error during repository creation:", err);

    res.status(500).json({
      error: err.message,
    });
  }
}

async function getAllRepositories(req, res) {
  try {
    const { userID } = req.query;
    let repositories;
    if (userID && mongoose.Types.ObjectId.isValid(userID)) {
      repositories = await Repository.find({
        visibility: true,
        owner: { $ne: userID },
      })
        .populate("owner")
    } else {
      repositories = await Repository.find({
        visibility: true,
      })
        .populate("owner")
    }

   res.json(repositories);
  } catch (err) {
    console.error("Error during fetching repositories : ", err.message);
    res.status(500).send("Server error");
  }
}


async function fetchRepositoryById(req, res) {
  const { id } = req.params;

  try {
    const repository = await Repository.findById(id)
      .populate("owner")

    if (!repository) {
      return res.status(404).json({
        error: "Repository not found!",
      });
    }

    res.json(repository);
  } catch (err) {
    console.error(
      "Error during fetching repository:",
      err.message
    );

    res.status(500).json({
      error: "Server error",
    });
  }
}

async function fetchRepositoryByName(req, res) {
  const { name } = req.params;

  try {
    const repository = await Repository.find({ name }).populate("owner")
    res.json(repository);
  } catch (err) {
    console.error("Error during fetching repository : ", err.message);
    res.status(500).send("Server error");
  }
}

async function fetchRepositoriesForCurrentUser(req, res) {
  const { userID } = req.params;
  try {
    const repositories = await Repository.find({ owner: userID });
    res.json({
      message: "Repositories fetched successfully!",
      repositories,
    });
  } catch (err) {
    console.error("Error during fetching user repositories : ", err.message);
    res.status(500).send("Server error");
  }
}


async function updateRepositoryById(req, res) {
  const { id } = req.params;
  const { userId, name, description, visibility , content } = req.body;

  try {
    const repository = await Repository.findById(id);

    if (!repository) {
      return res.status(404).json({ error: "Repository not found!" });
    }
    if (repository.owner.toString() !== userId) {
      return res.status(403).json({
        error: "You can only edit your own repository!",
      });
    }

    repository.name = name;
    repository.description = description;
    repository.visibility = visibility;
    repository.content = content;

    const updatedRepository = await repository.save();

    res.json({
      message: "Repository updated successfully!",
      repository: updatedRepository,
    });
  } catch (err) {
    console.error("Error during updating repository : ", err.message);
    res.status(500).send("Server error");
  }
}


async function deleteRepositoryById(req, res) {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const repository = await Repository.findById(id);

    if (!repository) {
      return res.status(404).json({ error: "Repository not found!" });
    }
    if (repository.owner.toString() !== userId) {
      return res.status(403).json({
        error: "You can only delete your own repository!",
      });
    }
    await Repository.findByIdAndDelete(id);

    res.json({
      message: "Repository deleted successfully!",
    });
  } catch (err) {
    console.error("Error during deleting repository : ", err.message);
    res.status(500).send("Server error");
  }
}

module.exports = {
  createRepository,
  getAllRepositories,
  fetchRepositoryById,
  fetchRepositoryByName,
  fetchRepositoriesForCurrentUser,
  updateRepositoryById,
  deleteRepositoryById,
};