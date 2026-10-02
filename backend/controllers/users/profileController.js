const bcrypt = require("bcryptjs");
const User = require("../../models/userModel");
const Repository = require("../../models/repoModel");


async function getAllUsers(req, res) {
  try {
    const users = await User.find({});

    res.json(users);
  } catch (err) {
    console.error("Error during fetching users:", err.message);
    res.status(500).send("Server error!");
  }
}


async function getUserProfile(req, res) {
  const currentID = req.params.id;

  try {
    if (!currentID) {
      return res.status(400).json({
        message: "User ID is required!",
      });
    }

    const user = await User.findById(currentID);

    if (!user) {
      return res.status(404).json({
        message: "User not found!",
      });
    }

    const repositories = await Repository.find({
      owner: currentID,
      visibility: true,
    });

    res.json({
      ...user.toObject(),
      repositories,
    });
  } catch (err) {
    console.error("Error during fetching user:", err.message);
    res.status(500).send("Server error!");
  }
}


async function updateUserProfile(req, res) {
  const currentID = req.params.id;
  const { email, password } = req.body;

  try {
    if (!currentID) {
      return res.status(400).json({
        message: "User ID is required!",
      });
    }

    let updateFields = {
      email,
    };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      updateFields.password = hashedPassword;
    }

    const result = await User.findByIdAndUpdate(
      currentID,
      updateFields,
      {
        new: true,
      }
    );

    if (!result) {
      return res.status(404).json({
        message: "User not found!",
      });
    }

    res.json(result);
  } catch (err) {
    console.error("Error during updating:", err.message);
    res.status(500).send("Server error!");
  }
}


async function deleteUserProfile(req, res) {
  const currentID = req.params.id;

  try {
    if (!currentID) {
      return res.status(400).json({
        message: "User ID is required!",
      });
    }

    const result = await User.findByIdAndDelete(currentID);

    if (!result) {
      return res.status(404).json({
        message: "User not found!",
      });
    }

    res.json({
      message: "User Profile Deleted!",
    });
  } catch (err) {
    console.error("Error during deleting:", err.message);
    res.status(500).send("Server error!");
  }
}


module.exports = {
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
};