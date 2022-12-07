const client = require("./client");

// database functions

// user functions
async function createUser({ username, password }){
 
    const { rows: [ user ] } = await client.query(`
      INSERT INTO users(username, password)
      VALUES($1, $2, $3, $4) 
      ON CONFLICT (username) DO NOTHING 
      RETURNING *;
    `, [username, password]);

    return user;

}

async function getUser({ username, password }) {

}

async function getUserById(userId) {

}

async function getUserByUsername(userName) {

}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
