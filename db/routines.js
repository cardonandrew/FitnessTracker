const { getAllActivities } = require('./activities');
const client = require('./client');
const { destroyRoutineActivity, getRoutineActivitiesByRoutine } = require('./routine_activities');
const { getUserById } = require('./users');

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
  try {
    const { rows } = await client.query(
      `
        SELECT username
        FROM users;
      `
    );
    let routines = [];
    for (let i = 0; i < rows.length; i++) {  
      let user = rows[i];
      let allRoutines = await getAllRoutinesByUser(user)
      routines.push(allRoutines);
    }
    routines = routines.flat();
    
    return routines;

  } catch (error) {
    console.log("Could not get routines");
    throw error;
  }
}

async function getAllRoutines() {
  try {
    const { rows } = await client.query(
      `
        SELECT username
        FROM users;
      `
    );
    let routines = [];
    for (let i = 0; i < rows.length; i++){
      let user = rows[i];
      let allRoutines = await userRoutines_HELPER(user)
      routines.push(allRoutines);
    }
    routines = routines.flat();
    let allActivities = await getAllActivities();

    for (let i = 0; i < routines.length; i++) {
      let routineObj = routines[i];
      routineObj.activities = [];
      let routineID = {id: routineObj.id}
      let rout_Acts = await getRoutineActivitiesByRoutine(routineID)
      allActivities.forEach((activity) => {
        for (let i = 0; i < rout_Acts.length; i++)  {
          let eachRoutineAct = rout_Acts[i];
          if (activity.id === eachRoutineAct.activityId) {
            if (activity.duration === undefined)  {
              activity.duration = eachRoutineAct.duration;
              activity.count = eachRoutineAct.count;
              activity.routineActivityId = eachRoutineAct.id;
              activity.routineId = routineObj.id;
              routineObj.activities.push(activity);
            } else {
              routineObj.activities.push(activity);
            }
          }
        }
      })

    }

    return routines;

  } catch (error) {
    console.log("Could not get all routines");
    throw error;
  }
  
}

async function userRoutines_HELPER({username}) {
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

async function getAllRoutinesByUser({username}) {
  try {
    let routines = [];
    let allRoutines = await userRoutines_HELPER({username: username})
    routines.push(allRoutines);

    routines = routines.flat();
    let allActivities = await getAllActivities();

    for (let i = 0; i < routines.length; i++) {
      let routineObj = routines[i];
      routineObj.activities = [];
      let routineID = {id: routineObj.id}
      let rout_Acts = await getRoutineActivitiesByRoutine(routineID)
      allActivities.forEach((activity) => {
        for (let i = 0; i < rout_Acts.length; i++)  {
          let eachRoutineAct = rout_Acts[i];
          if (activity.id === eachRoutineAct.activityId) {
            if (activity.duration === undefined)  {
              activity.duration = eachRoutineAct.duration;
              activity.count = eachRoutineAct.count;
              activity.routineActivityId = eachRoutineAct.id;
              activity.routineId = routineObj.id;
              routineObj.activities.push(activity);
            } else {
              routineObj.activities.push(activity);
            }
          }
        }
      })
    }

    return routines;

  } catch (error) {
    console.log("Could not get all routines by user");
    throw error;
  }
}

async function getPublicRoutinesByUser({username}) {
  try {
    let routines = [];
    let allRoutines = await getUsersPublicRoutines_HELPER({username: username})
    routines.push(allRoutines);

    routines = routines.flat();
    let allActivities = await getAllActivities();

    for (let i = 0; i < routines.length; i++) {
      let routineObj = routines[i];
      routineObj.activities = [];
      let routineID = {id: routineObj.id}
      let rout_Acts = await getRoutineActivitiesByRoutine(routineID)
      allActivities.forEach((activity) => {
        for (let i = 0; i < rout_Acts.length; i++)  {
          let eachRoutineAct = rout_Acts[i];
          if (activity.id === eachRoutineAct.activityId) {
            if (activity.duration === undefined)  {
              activity.duration = eachRoutineAct.duration;
              activity.count = eachRoutineAct.count;
              activity.routineActivityId = eachRoutineAct.id;
              activity.routineId = routineObj.id;
              routineObj.activities.push(activity);
            } else {
              routineObj.activities.push(activity);
            }
          }
        }
      })
    }

    return routines;

  } catch (error) {
    console.log("Could not get all routines by user");
    throw error;
  }

}

async function getAllPublicRoutines() {
  try {
    const { rows } = await client.query(
      `
        SELECT username
        FROM users;
      `
    );
    let routines = [];
    for (let i = 0; i < rows.length; i++) {
      let user = rows[i];
      let publicRoutines = await getUsersPublicRoutines_HELPER(user)
      routines.push(publicRoutines);
    }
    routines = routines.flat();
    let allActivities = await getAllActivities();

    for (let i = 0; i < routines.length; i++) {
      let routineObj = routines[i];
      routineObj.activities = [];
      let routineID = {id: routineObj.id}
      let rout_Acts = await getRoutineActivitiesByRoutine(routineID)
      allActivities.forEach((activity) => {
        for (let i = 0; i < rout_Acts.length; i++)  {
          let eachRoutineAct = rout_Acts[i];
          if (activity.id === eachRoutineAct.activityId) {
            if (activity.duration === undefined)  {
              activity.duration = eachRoutineAct.duration;
              activity.count = eachRoutineAct.count;
              activity.routineActivityId = eachRoutineAct.id;
              activity.routineId = routineObj.id;
              routineObj.activities.push(activity);
            } else {
              routineObj.activities.push(activity);
            }
          }
        }
      })
    }

    return routines;

  } catch (error) {
    console.log("Could not get all public routines");
    throw error;
  }
  
}

async function getUsersPublicRoutines_HELPER({username})  {
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
        WHERE "creatorId"=${ userID.id }
        AND "isPublic"=true;
      `);
      
      rows.forEach((routine) => routine.creatorName = username);
      return rows;
  } catch (error) {
    console.log("Could not get all routines by user");
    throw error;
  }
}

async function getPublicRoutinesByActivity({id}) {

  try {
    const activity = await activitiesById_HELPER(id);
    const routine_activities = await routineActsByActID_HELPER(activity.id);

    for (let i = 0; i < routine_activities.length; i++) {
      let RA = routine_activities[i];
      console.log("ROUTINE ACTIVITY ID:", RA.id);
      let routineID = RA.routineId;
      let { rows: [ routine ] } = await client.query(
        `
          SELECT *
          FROM routines
          WHERE "isPublic"=true
          AND id=${routineID};
        `
      );

      if (!routine) {
        return;
      }
      let { username } = await getUserById(routine.creatorId);
      routine.creatorName = username;

      activity.duration = RA.duration;
      activity.count = RA.count;
      activity.routineId = routineID;
      activity.routineActivityId = RA.id;
      let activities = [activity];
      routine.activities = activities;

      return [routine];

    }

  } catch (error) {
    console.log("Could not get Public Routines by Activity");
    throw error;
  }
}

async function routineActsByActID_HELPER(ID){
  const { rows } = await client.query(
    `
      SELECT *
      FROM routine_activities
      WHERE "activityId"=${ID};
    `
  );

  return rows;
}

async function activitiesById_HELPER(ID) {
  let { rows: [ activity ] } = await client.query(
    `
      SELECT *
      FROM activities
      WHERE id=${ID};
    `
  );
  
  return activity;
}

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
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
}