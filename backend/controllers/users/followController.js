const User = require("../../models/userModel");

async function followUser(req, res) {
  const { userId, targetUserId } = req.body;

  try {
    if (!userId || !targetUserId) {
      return res.status(400).json({
        message: "User ID and target user ID are required!",
      });
    }
    if (String(userId) === String(targetUserId)) {
      return res.status(400).json({
        message: "You cannot follow yourself!",
      });
    }
    const currentUser = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({
        message: "User not found!",
      });
    }
    
    await User.findByIdAndUpdate(userId, {
      $addToSet: {
        followedUsers: targetUserId,
      },
    });

    await User.findByIdAndUpdate(targetUserId, {
      $addToSet: {
        followers: userId,
      },
    });

    res.json({
      message: "User followed successfully!",
    });
  } catch (err) {
    console.error("Error while following user:", err.message);
    res.status(500).send("Server error!");
  }
}


async function unfollowUser(req, res) {
  const { userId, targetUserId } = req.body;
  try {
    if (!userId || !targetUserId) {
      return res.status(400).json({
        message: "User ID and target user ID are required!",
      });
    }
    const currentUser = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({
        message: "User not found!",
      });
    }

    await User.findByIdAndUpdate(userId, {
      $pull: {
        followedUsers: targetUserId,
      },
    });

    await User.findByIdAndUpdate(targetUserId, {
      $pull: {
        followers: userId,
      },
    });

    res.json({
      message: "User unfollowed successfully!",
    });
  } catch (err) {
    console.error("Error while unfollowing user:", err.message);
    res.status(500).send("Server error!");
  }
}


module.exports = {
  followUser,
  unfollowUser,
};