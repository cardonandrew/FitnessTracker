const client = require('./client');

async function getRoutineById(id){
  try {
    const {row: [routine]} = await client.query(`
    SELECT * 
    FROM routines
    WHERE id=$1;
  ` [id]);

  return routine;

  } catch (error) {
    console.log("Could not get routine by ID")
    throw error;
  }
  
}

async function getRoutinesWithoutActivities(){
}

async function getAllRoutines() {
  try {
    const routines = await client.query(`
    SELECT *
    FROM routines;
  `)

  return routines;

  } catch (error) {
    console.log("Could not get all routines");
    throw error;
  }
  
}

async function getAllRoutinesByUser({username}) {
  const routines = await client.query(`
    
  `)
}

async function getPublicRoutinesByUser({username}) {
}

async function getAllPublicRoutines() {
  try {
    const routines = await client.query(`
    SELECT *
    FROM routines
    WHERE "isPublic"=true;
  `)
  return routines;

  } catch (error) {
    console.log("Could not get all public routines");
    throw error;
  }
  
}

async function getPublicRoutinesByActivity({id}) {

}

async function createRoutine({creatorId, isPublic, name, goal}) {
  try {

    await client.query(`
    INSERT INTO routines("creatorId", "isPublic", name, goal)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (name) DO NOTHING;
  ` [creatorId, isPublic, name, goal]);

  const {row: [routine]} = await client.query(`
    SELECT *
    FROM routines
    WHERE name=${name};
  `)

  return routine;

  } catch (error) {
    console.log("Could not complete 'createroutine'");
    throw error;
  }
  
}

async function updateRoutine({id, ...fields}) {
}

async function destroyRoutine(id) {
  try {
    const routines = await client.query(`
    DELETE FROM routines
    WHERE id=${id};
  `)

  return routines;

  } catch (error) {
    console.log("Could not delete routine");
    throw error;
  }
  
}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities, 
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
}