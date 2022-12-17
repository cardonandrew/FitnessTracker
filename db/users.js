const client = require("./client");
const bcrypt = require('bcrypt');

// database functions
const deletePass = (user) => {
  if(user.password){
    delete user.password
  }
  return;
}
// user functions
async function createUser({ username, password }){

  const SALT_COUNT = 10;

  try{

      const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
      if(!password || !username){throw Error("Error finding credentials")}

    const { rows: [ user ] } = await client.query(`
      INSERT INTO users(username, password)
      VALUES($1, $2) 
      ON CONFLICT (username) DO NOTHING 
      RETURNING *;
    `, [username, hashedPassword]);

    deletePass(user)

    return user;
  } catch (error) {
    console.log(error)
  }
}
 
async function getUser({ username, password }) {
  try {

    const getUser = await getUserByUsername(username);
    const hashedPassword = getUser.password;
    const isValid = await bcrypt.compare(password, hashedPassword);

    if (!isValid) {
      throw Error("Password is incorrect.")
    }

    const { rows: [user] } = await client.query(`
      SELECT *
      FROM users
      WHERE username=$1 AND password=$2
    `, [username, hashedPassword]);
    
    deletePass(user)

    return user;
    } catch(error){
      console.log(error)
    }
  }

async function getUserById(userId) {
  try {
      const { rows: [user] } = await client.query(`
        SELECT *
        FROM users
        WHERE "id"=$1;
      `, [userId]);
      deletePass(user)

    return user;
  } catch (error) {
    console.log(error)
  }
}


async function getUserByUsername(userName) {
  try {
      const { rows: [user] } = await client.query(`
        SELECT *
        FROM users
        WHERE username=$1;
      `, [userName]);
  
      return user;
  } catch (error) {
    console.log(error)
  }
    
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}