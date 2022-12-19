const express = require('express');
const activitiesRouter = express.Router();
const { getAllActivities, updateActivity } = require('../db');
const { createActivity } = require('../db');
const { getActivityById, getActivityByName, getPublicRoutinesByActivity } = require('../db');
const {  client } = require('../db');

// GET /api/activities/:activityId/routines  -  Get a list of all public routines which feature that activity
activitiesRouter.get('/:activityId/routines', async (req, res, next) => {
  try {
    const activityId  = req.params['activityId'];
    const activity = {
      id:activityId
    }
    const routineFromActivity = await getPublicRoutinesByActivity(activity)
  //   const {rows} = await client.query(`SELECT v.id, s.count, s.duration, v.description, v.name FROM routine_activities s
  // INNER JOIN routines r ON s."routineId" = r.id
  // INNER JOIN activities v ON v.id = s."activityId"
  // where s."activityId" = $1 and r."isPublic" is true`, [activityId]);
  // console.log(rows);


  if(routineFromActivity.length == 0){
    res.send({
        name: 'Error',
        message: `Activity ${activityId} not found`,
        error:'error'
    })
  }else{
    res.send(routineFromActivity);
  }
  
  } catch ({ name, message, error }) {
    next({ name, message, error });
  }
});

// GET /api/activities  -  Just return a list of all activities in the database
activitiesRouter.get('/', async (req, res, next) => {
    try {
      const allActivities = await getAllActivities();
      res.send(
        allActivities
    );
    } catch ({ name, message }) {
      next({ name, message });
    }
  });

// POST /api/activities  -  Create a new activity
activitiesRouter.post('/', async (req, res, next) => {
    //const { name, description = "" } = req.body;
    //console.log(req.body);
    try {
      //const activityData = {name, description};
      
      const activity = await createActivity(req.body);
      
      if(activity){
        res.send(activity)
       } else {
          next({ 
            name: 'error', 
            message: 'An activity with name Push Ups already exists'
          });
        }
    } catch ({ name, message }) {
      next({ name, message });
    }
  });

// PATCH /api/activities/:activityId  -  Anyone can update an activity (yes, this could lead to long term problems a la wikipedia)
activitiesRouter.patch('/:activityId', async (req, res, next) => {
  const activityId  = req.params['activityId'];

  try {
    const check = await getActivityById(activityId);
    if(check == undefined){
      res.send({"error":"wrong", "message":"Activity "+activityId +" not found", "name":"error"})
    }else{
      const checkname = await getActivityByName(req.body.name);
      
      if(checkname != null){
        res.send({"error":"wrong", "message":"An activity with name " + req.body.name + " already exists", "name":"error"})
      }else{
        const query11 = `UPDATE activities SET name = '` + req.body.name + `', description = '` + req.body.description + `' WHERE id = `+ activityId + ` RETURNING *;`;

        const { rows:[a] } = await client.query(query11);

        res.send(a)
      }

    }
    
  } catch (error) {
    next(error);
  }
});

module.exports = activitiesRouter;