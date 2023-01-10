const express = require("express");
const routinesRouter = express.Router();
const { getAllPublicRoutines, createRoutine, getRoutineById, updateRoutine, destroyRoutine, getActivityById } = require("../db");
const jwt = require('jsonwebtoken')

// GET /api/routines
routinesRouter.get("/", async (req, res, next) => {
    try {
        const allPublicRoutines = await getAllPublicRoutines();
        res.send(allPublicRoutines);
    } catch (error) {
        next(error);
    }
});

// POST /api/routines
routinesRouter.post("/", async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (authorization === undefined) {
            res.status(401)
            res.send({
              "error": "No Token supplied",
              "message": "You must be logged in to perform this action",
              "name": "Token Error"
            })
          }

        const tokenString = authorization.slice(7, -1);
        const tokenCheck = jwt.decode(tokenString);

        const { isPublic, name, goal } = req.body;
        if (!(name && goal)) {
            res.status(400)
            res.send({
              "error": "Missing information",
              "message": "A required field is missing. Please fill out all fields.",
              "name": "Error"
            })
        }

        const routineData = {
            creatorId: tokenCheck.id,
            isPublic: isPublic,
            name: name,
            goal: goal
        }
        const newRoutine = await createRoutine(routineData);
        res.send(newRoutine);
    } catch (error) {
        next(error)
    }
});

// PATCH /api/routines/:routineId
routinesRouter.patch("/:routineId", async (req, res, next) => {
    
    try {
        const { authorization } = req.headers;
        const { routineId } = req.params
        if (authorization === undefined) {
            res.status(400)
            res.send({
              "error": "No Token supplied",
              "message": "You must be logged in to perform this action",
              "name": "Token Error"
            })
            
          } else if (routineId === undefined) {
            res.status(403)
            res.send({
              "error": "Not Authorized",
              "message": `User ${tokenCheck.username} is not allowed to update ${name}`,
              "name": "Auth Error"
            })
          }
        const tokenString = authorization.slice(7, -1);
        const tokenCheck = jwt.decode(tokenString);
        const routineToUpdate = await getRoutineById(routineId)
        
        if (tokenCheck.id !== routineToUpdate.creatorId) {
            res.status(403)
            res.send({
              "error": "Not Authorized",
              "message": `User ${tokenCheck.username} is not allowed to update ${routineToUpdate.name}`,
              "name": "Auth Error"
            })
        } else {
            const updatedRoutine = await updateRoutine({id: routineId, ...req.body})
            res.send(updatedRoutine)
        }
        
    } catch (error) {
        next(error)
    }
})

// DELETE /api/routines/:routineId
routinesRouter.delete("/:routineId", async (req, res, next) => {
    try {
        const { routineId } = req.params;
        const { authorization } = req.headers;
        const tokenString = authorization.slice(7, -1);
        const tokenCheck = jwt.decode(tokenString);
        const routineToDelete = await getRoutineById(routineId);

        if (tokenCheck.id !== routineToDelete.creatorId) {
            res.status(403)
            res.send({
              "error": "Not Authorized",
              "message": `User ${tokenCheck.username} is not allowed to delete ${routineToDelete.name}`,
              "name": "Auth Error"
            })
        } else {
            const deletedRoutine = await destroyRoutine(routineId);
            res.send(deletedRoutine);
        }


    } catch (error) {
        next(error)
    }
})

// POST /api/routines/:routineId/activities
routinesRouter.post("/:routineId/activities", async (req, res, next) => {
    // console.log("REQUEST params:", req.params)
    console.log("REQUEST BODY:", req.body)

    try {
        const { authorization } = req.headers;
        const { routineId, activityId, count, duration } = req.body;
        const tokenString = authorization.slice(7, -1);
        const tokenCheck = jwt.decode(tokenString);

        const activity = await getActivityById(activityId);
        console.log("ACTIVITY:", activity)
        const routine = await getRoutineById(routineId);
        console.log("ROUTINE:", routine)


        res.send(req.body)
    } catch (error) {
        next(error)
    }
})
module.exports = routinesRouter;
