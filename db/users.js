const client = require("./client");

// database functions
const deletePass = (user) => {
  if(user.password){
    delete user.password
  }
  return
}
// user functions
async function createUser({ username, password }){
  try{
      if(!password || !username){throw Error("Error finding credentials")}

    const { rows: [ user ] } = await client.query(`
      INSERT INTO users(username, password)
      VALUES($1, $2) 
      ON CONFLICT (username) DO NOTHING 
      RETURNING *;
    `, [username, password]);

    deletePass(user)

    return user;
  } catch (error) {
    console.log(error)
  }
}
 
async function getUser({ username, password }) {
try{
    const { rows: [user] } = await client.query(`
      SELECT *
      FROM users
      WHERE username=$1 AND password=$2
    `, [username, password]);

    if(password != user.password){throw Error("Password doesn't match")}
    
    deletePass(user)

    return user;
    }catch(error){
      console.log(error)
    }
  }

async function getUserById(userId) {
  console.log(userId, "userID")
    const { rows: [user] } = await client.query(`
      SELECT *
      FROM users
      WHERE "id"=$1;
  `, [userId]);
  deletePass(user)

return user;
}


async function getUserByUsername(userName) {

      const { rows: [user] } = await client.query(`
        SELECT *
        FROM users
        WHERE username=$1;
      `, [userName]);
  
      return user;
  }

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}