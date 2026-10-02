const express = require('express');
const mainRouter  =  express.Router();
const userRouter  = require('./user.router')
const repoRouter  = require('./repo.router')

mainRouter.use(userRouter);
mainRouter.use('/repo' , repoRouter);
mainRouter.get('/' , (req,res)=>{
   res.send("Listning on port 3000")
  })

module.exports = mainRouter;