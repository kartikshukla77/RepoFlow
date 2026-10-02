const express = require("express");

const authController = require("../controllers/users/authController");
const profileController = require("../controllers/users/profileController");
const followController = require("../controllers/users/followController");
const starRepoController = require("../controllers/users/starRepoController");

const userRouter = express.Router();


userRouter.post("/signup", authController.signup);
userRouter.post("/login", authController.login);


userRouter.get("/allUsers", profileController.getAllUsers);
userRouter.get("/userProfile/:id", profileController.getUserProfile);
userRouter.put("/updateProfile/:id",profileController.updateUserProfile);
userRouter.delete("/deleteProfile/:id",profileController.deleteUserProfile);


userRouter.post("/follow", followController.followUser);
userRouter.post("/unfollow", followController.unfollowUser);


userRouter.post("/star", starRepoController.starRepository);
userRouter.post("/unstar", starRepoController.unstarRepository);
userRouter.get("/starred/:userId",starRepoController.getStarredRepositories);


module.exports = userRouter;