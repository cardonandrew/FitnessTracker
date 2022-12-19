const client = require("./client")

// database functions
async function getAllActivities() {
    try {
      const { rows } = await client.query(`
      SELECT *
      FROM activities;
    `);

    return rows;
  } catch (error) {
    return {
      error: "Error getting all activities!"
    }
  }
}

async function getActivityById(id) {
    try {
        const { rows: [ activity ]  } = await client.query(`
          SELECT *
          FROM activities
          WHERE id=$1;
        `, [id]);

        //if (!activity) {
        //    throw {
        //        Name: "ActivityNotFoundError",
        //        message: "Could not find an activity with that id"
        //    };
       // }
        return activity;
    } catch (error) {
      console.log("Error getting activity by ID!");
      throw error;
    }
}

async function getActivityByName(name) {
  try {
    const { rows: [ activity ] } = await client.query(`
      SELECT *
      FROM activities
      WHERE name=$1;
    `,[name]);

    if (!activity) {
      return null
    }

    return activity;
  } catch (error) {
    console.log("Error getting activity by name");
    throw error;
  }
}

// select and return an array of all activities
async function attachActivitiesToRoutines(routines) {
  try {
    const {rows:[arr]} = await client.query(`SELECT * FROM public.activities a
    INNER JOIN public.routine_activities r ON a.id = r."activityId"
    where r."routineId" = $1`, [routines.id])

    return arr

  } catch (error) {
    console.log("Error attaching activity to routine!");
    throw error;
  }
}

// return the new activity
async function createActivity({ name, description }) {
    try {
      const { rows: [ activity ] } = await client.query(`
        INSERT INTO activities(name, description)
        VALUES ($1, $2)
        RETURNING *;
      `, [name, description]);
      return activity;
      } catch (error) {
        return {
          error: "Error creating activity!"  
        }
      }
}

// don't try to update the id
// do update the name and description
// return the updated activity
async function updateActivity({ id, ...fields }) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');

  if (setString.length === 0) {
    return;
  }

  try {
    const { rows: [ activity ] } = await client.query(`
      UPDATE activities
      SET ${ setString }
      WHERE id=${ id }
      RETURNING *;
    `, Object.values(fields));

    return activity;
  } catch (error) {
    return {
      error: "Error updating activities!"
    }
  }
}


module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
}
