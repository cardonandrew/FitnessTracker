const client = require('./client');

async function getRoutineById(id){
  const {row: [routine]} = await client.query(`
    SELECT * 
    FROM routines
    WHERE id=$1;
  ` [id]);

  return routine;
}

async function getRoutinesWithoutActivities(){
}

async function getAllRoutines() {
  const routines = await client.query(`
    SELECT *
    FROM routines;
  `)

  return routines;
}

async function getAllRoutinesByUser({username}) {
  const routines = await client.query(`
    
  `)
}

async function getPublicRoutinesByUser({username}) {
}

async function getAllPublicRoutines() {
  const routines = await client.query(`
    SELECT *
    FROM routines
    WHERE "isPublic"=true;
  `)
}

async function getPublicRoutinesByActivity({id}) {
}

async function createRoutine({creatorId, isPublic, name, goal}) {
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
}

async function updateRoutine({id, ...fields}) {
}

async function destroyRoutine(id) {
  const routines = await client.query(`
    DELETE FROM routines
    WHERE id=${id};
  `)

  return routines;
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