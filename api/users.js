const express = require('express');
const usersRouter = express.Router();
const jwt = require('jsonwebtoken');

const { getUser, getUserByUsername, createUser, getUserById } = require('../db');
// POST /api/users/login
usersRouter.post('/login', async (req, res, next) => {
    const {username, password} = req.body

    if (!username || !password) {
        next({
          name: "MissingCredentialsError",
          message: "Please supply both a username and password"
        });
      }
      try {
        const user = await getUserByUsername(username);
        console.log("user", user)
    
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
        console.log(error);
        next(error);
      }
    });

// POST /api/users/register
usersRouter.post('/register', async (req, res, next) => {
    const { username, password} = req.body;
  
    try {
      const _user = await getUserByUsername(username);
  
      if (_user) {
        next({
          name: 'UserExistsError',
          message: 'A user by that username already exists'
        });
      }
  
      const user = await createUser({
        username,
        password,
      });
  
      const token = jwt.sign({ 
        id: user.id, 
        username
      }, process.env.JWT_SECRET, {
        expiresIn: '1w'
      });
  
      res.send({ 
        message: "thank you for signing up",
        token 
      });
    } catch ({ name, message }) {
      next({ name, message })
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
usersRouter.get(':username/routines', async (req, res, next) => {
const { username } = req.body

});
module.exports = usersRouter;
