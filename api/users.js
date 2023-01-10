const express = require('express');
const usersRouter = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const { getUserByUsername, createUser, getUser, getPublicRoutinesByUser } = require('../db');
// POST /api/users/login
usersRouter.post('/login', async (req, res, next) => {
    const {username, password} = req.body;
      try {
        if (!(username && password)) {
          const err = new Error()
          err.name = "Internal Server Error";
          err.error = "User Conflict";
          err.message = "Password Too Short!";
          res.status(500);
          res.send(err)
          next(err)
        }
        const user = await getUser(req.body);
    
        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
        
        const userData = {
          user: user,
          token: token,
          message: "you're logged in!"
        }
        res.send(userData);
        
      } catch(error) {
        next(error)
      }
    });

// POST /api/users/register
usersRouter.post('/register', async (req, res, next) => {
    try {
      const { username, password } = req.body;

      if (password.length < 8) {
        const err = new Error()
        err.name = "Internal Server Error";
        err.error = "User Conflict";
        err.message = "Password Too Short!";
        res.status(500);
        res.send(err)
        next(err)
      }

      const user = await getUserByUsername(username);

      if (user) {
        const err = new Error()
        err.name = "Internal Server Error";
        err.error = "User Conflict";
        err.message = `User ${user.username} is already taken.`
        res.status(500)
        res.send(err)
        next(err)
      }
  
      const createdUser = await createUser(req.body);
  
      const token = jwt.sign({username: createdUser.username}, JWT_SECRET);
      const response = {
        "message": "Thank you for signing up",
        "token": token,
        "user": createdUser
      };
      res.send(response);

    } catch (error) {
      next(error);
    } 
  });

// GET /api/users/me
usersRouter.get('/me', async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (authorization === undefined) {
      res.status(401)
      res.send({
        "error": "No Token supplied",
        "message": "You must be logged in to perform this action",
        "name": "Token Error"
      })
    }

    const tokenString = authorization.slice(7, -1)
    const tokenCheck = jwt.decode(tokenString)
    const user = await getUserByUsername(tokenCheck.username);
    res.send(user)
    
  } catch (error) {
    next(error)
  }
    
});
  
// GET /api/users/:username/routines
usersRouter.get('/:username/routines', async (req, res, next) => {
  try {
    const { username } = req.params;
    const { authorization } = req.headers;
    const tokenString = authorization.slice(7, -1);
    const tokenCheck = jwt.decode(tokenString);

    const pubRoutines = await getPublicRoutinesByUser({username: username});
    res.send(pubRoutines)

  } catch (error) {
    next(error)
  }
});

module.exports = usersRouter;
