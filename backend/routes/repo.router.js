const express = require("express");
const repoController = require("../controllers/repository/repoController");
const repoRouter = express.Router();

repoRouter.post("/create", repoController.createRepository);
repoRouter.get("/all", repoController.getAllRepositories);
repoRouter.get("/name/:name", repoController.fetchRepositoryByName);
repoRouter.get("/user/:userID",repoController.fetchRepositoriesForCurrentUser);

repoRouter.get("/:id", repoController.fetchRepositoryById);
repoRouter.put("/update/:id", repoController.updateRepositoryById);
repoRouter.delete("/delete/:id", repoController.deleteRepositoryById);

module.exports = repoRouter;