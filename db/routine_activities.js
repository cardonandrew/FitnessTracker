const client = require('./client')

async function getRoutineActivityById(id){
    try {
        const { rows: [ routine_activity ] } = await client.query(`
            SELECT *
            FROM routine_activities
            WHERE id=$1;
        `, [id]);

        if (!routine_activity) {
            throw {
                name: "RoutineActivityNotFoundError",
                message: "Could not find an routine activity with that id"
            }
        }

        return routine_activity;
    } catch (error) {
        console.log("Error getting routine_activities by ID!");
        throw error;
    }
}

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
    try {
      const { rows:[routineAct]} = await client.query(`
      INSERT INTO routine_activities("routineId", "activityId", count, duration)
      VALUES($1, $2, $3, $4)
      RETURNING *
      `,[routineId, activityId, count, duration]);

      return routineAct;
    } catch (error) {
      console.log("Error adding activity to routine!");
      throw error;
    }
    
}

async function getRoutineActivitiesByRoutine({id}) {
  try {
    const { rows } = await client.query(`
      SELECT *
      FROM routine_activities
      WHERE "routineId" = $1
    `,[id]);

    return rows;
  } catch (error) {
    console.log("Error getting routine_activity by routine");
    throw error;
  }
}

async function updateRoutineActivity ({id, ...fields}) {
    const setString = Object.keys(fields).map(
        (key, index) => `"${ key }"=$${ index + 1 }`
      ).join(', ');
    
      if (setString.length === 0) {
        return;
      }
    
      try {
        const { rows: [ routine_activity ] } = await client.query(`
          UPDATE routine_activities
          SET ${ setString }
          WHERE id=${ id }
          RETURNING *;
        `, Object.values(fields));
    
        return routine_activity;
      } catch (error) {
        console.log("Error udpating routine_activities!");
        throw error;
      }
}

async function destroyRoutineActivity(id) {
  try {
    const { rows : [arr] } = await client.query(`
      DELETE
      FROM routine_activities
      WHERE id = $1
      RETURNING *
      `, [id]);

      return arr;
    } catch (error) {
      console.log("Error destroying routine_activities!");
      throw error;
    }
}

async function canEditRoutineActivity(routineActivityId, userId){
  try{
    const { rows : [rou] } = await client.query(`
    SELECT *
    FROM routine_activities
    WHERE id = $1
    `, [routineActivityId]);
    
    const { rows : [test] } = await client.query(`
    SELECT *
    FROM routines
    WHERE id = $1
    `, [rou.routineId]);

    if(test.creatorId == userId){
      return true
    } else {
      return false
    }

  } catch(error){
    console.log("Error updating routine_activities to be editable!");
    throw error;
  }
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
