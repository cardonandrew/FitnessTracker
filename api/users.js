const express = require('express');
const usersRouter = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const { getUser, getUserByUsername, createUser, getUserById } = require('../db');
// POST /api/users/login
usersRouter.post('/login', async (req, res, next) => {
    const {username, password} = req.body;
      try {
        if (!(username && password)) {
          next({
            name: "MissingCredentialsError",
            message: "Please supply both a username and password"
          });
        }
        const user = await getUserByUsername(username);
    
        if (user.password == password) {
          const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET);
          res.send({ message: "you're logged in!", token: token });
        } else {
          next({ 
            name: 'IncorrectCredentialsError', 
            message: 'Username or password is incorrect'
          });
        }
      } catch(error) {
        next(error)
      }
    });

// POST /api/users/register
usersRouter.post('/register', async (req, res, next) => {
    try {
      const { username, password } = req.body;
      console.log("REQUEST BODY:", req.body)

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
    const prefix = 'Bearer '
    const auth = req.headers['Authorization'];

    if (!auth) {
        next();
      }

    if (auth.startsWith(prefix)) {
        
        const token = auth.slice(prefix.length);

    try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET);
  
        const me = await getUserById(id);
        
        res.send(me)
  
        next();

      } catch (error) {
            console.log(error)
      }
}
  });
  
// GET /api/users/:username/routines
// usersRouter.get(':username/routines', async (req, res, next) => {
// const { username } = req.body

// });
module.exports = usersRouter;
