const client = require('./client');
const { destroyRoutineActivity, getRoutineActivitiesByRoutine } = require('./routine_activities');

async function getRoutineById(id){
  try {
    const { rows: [routine] } = await client.query(`
    SELECT * 
    FROM routines
    WHERE id=$1;
  `, [id]);

  return routine;

  } catch (error) {
    console.log("Could not get routine by ID")
    throw error;
  }
  
}

async function getRoutinesWithoutActivities() {
}
let routines  = [];
async function getAllRoutines() {
  try {
    const { rows } = await client.query(
      `
        SELECT username
        FROM users;
      `
    );
    rows.forEach(async (user) => {
      routines.push(await getAllRoutinesByUser(user));
    });

    console.log("ROUTINES:", routines)
    return routines;
    
  } catch (error) {
    console.log("Could not get all routines");
    throw error;
  }
  
}

async function getAllRoutinesByUser({username}) {
  try {
    const { rows: [ userID ] } = await client.query(
      `
        SELECT id
        FROM users
        WHERE username=$1;
      `, [username] );

    const { rows } = await client.query(
      `
        SELECT *
        FROM routines
        WHERE "creatorId"=${ userID.id };
      `);

      rows.forEach((routine) => routine.creatorName = username);
      return rows;
  } catch (error) {
    console.log("Could not get all routines by user");
    throw error;
  }
}

// async function getPublicRoutinesByUser({username}) {
// }

async function getAllPublicRoutines() {
  try {
    const { rows } = await client.query(`
    SELECT *
    FROM routines
    WHERE "isPublic"=true;
  `)
  return rows;

  } catch (error) {
    console.log("Could not get all public routines");
    throw error;
  }
  
}

// async function getPublicRoutinesByActivity({id}) {

// }

async function createRoutine({creatorId, isPublic, name, goal}) {
  
  try {
    const { rows: [routine] } = await client.query(
      `
        INSERT INTO routines ("creatorId", "isPublic", name, goal)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (name) DO NOTHING
        RETURNING *;
      `, 
      [creatorId, isPublic, name, goal]);

    return routine;

  } catch (error) {
    console.log("Could not complete 'createroutine'");
    throw error;
  }
  
}

async function updateRoutine({id, ...fields}) {
  const setString = Object.keys(fields).map((key, index) => `"${ key }"=$${ index + 1}`).join(', ');

  if (setString.length === 0) {
    return;
  }

  try {
    await client.query(`
      UPDATE routines
      SET ${ setString }
      WHERE id=${ id };
    `, Object.values(fields));

    const { rows: [ routine ]} = await client.query(`
      SELECT *
      FROM routines
      WHERE id=$1;
    `, [ id ]);

    return routine;

  } catch (error) {
    console.log("Could not update routine");
    throw error;
  }

}

async function destroyRoutine(id) {
  try {
    const { rows: [ routineID ]} = await client.query(
      `
        SELECT id
        FROM routines
        WHERE id=$1;
      `, [id]);

    const routineActivities = await getRoutineActivitiesByRoutine(routineID);
    routineActivities.forEach((routine_activ) => destroyRoutineActivity(routine_activ.id))

    await client.query(
      `
        DELETE FROM routines
        WHERE id=$1;
      `, [ id ]);


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
  // getPublicRoutinesByUser,
  // getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
}