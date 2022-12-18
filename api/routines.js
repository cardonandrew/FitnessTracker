const express = require('express');
const routinesRouter = express.Router();

const {getRoutineById,
    getRoutinesWithoutActivities,
    getAllRoutines,
    getAllPublicRoutines,
    getAllRoutinesByUser,
    getPublicRoutinesByUser,
    getPublicRoutinesByActivity,
    createRoutine,
    updateRoutine,
    destroyRoutine} = require('../db')

// GET /api/routines
routinesRouter.get('./routines', async (req, res, next) => {
    const allPublicRoutines = await getAllPublicRoutines()
    console.log('allRoutines:', allPublicRoutines)
    res.send(allPublicRoutines)
})
// POST /api/routines
routinesRouter.post('./routines', async (req, res, next) => {
    const {creatorId, isPublic, name, goal} = req.body

    if(!creatorId && !isPublic && !name && !goal){
        next({name:"Missing Information",
            message:"Please fill out all info"})
    }

    const newRoutine = await createRoutine(creatorId, isPublic, name, goal)
    
    res.send(newRoutine)

})
// PATCH /api/routines/:routineId

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = routinesRouter;
