const express = require("express");
const activitiesRouter = express.Router();
const { getAllActivities, updateActivity } = require("../db");
const { createActivity } = require("../db");
const { getPublicRoutinesByActivity } = require("../db");

// GET /api/activities/:activityId/routines  -  Get a list of all public routines which feature that activity
activitiesRouter.get("/:activityId/routines", async (req, res) => {
    const activity = {
        id: req.params.activityId
    };

    const routinesFromActivity = await getPublicRoutinesByActivity(activity);

    if (!routinesFromActivity.error) {
        res.send(routinesFromActivity);
    } else {
        res.send({
            name: "Error",
            error: routinesFromActivity.error,
            message: `Activity ${activity.id} not found`,
        });
    }
});

// GET /api/activities  -  Just return a list of all activities in the database
activitiesRouter.get("/", async (req, res) => {
    const allActivities = await getAllActivities();

    if (!allActivities.error) {
        res.send(allActivities);
    } else {
        res.send({
            name: "Error",
            error: allActivities.error,
            message: "Could not get all activities",
        });
    }
});

// POST /api/activities  -  Create a new activity
activitiesRouter.post("/", async (req, res) => {
    const activity = await createActivity(req.body);

    if (!activity.error) {
        res.send(activity);
    } else {
        res.send({
            name: "Error",
            error: activity.error,
            message: "An activity with name Push Ups already exists",
        });
    }
});

// PATCH /api/activities/:activityId  -  Anyone can update an activity (yes, this could lead to long term problems a la wikipedia)
activitiesRouter.patch("/:activityId", async (req, res) => {
    const updateData = {
        id: req.params.activityId
    }
    
    if (req.body.name) {
        updateData.name = req.body.name;
    }
    if (req.body.description) {
        updateData.description = req.body.description;
    }
    
    const updatedActivity = await updateActivity(updateData);

    if (!updatedActivity) {
        res.send({
            name: "Error",
            error: "Could not update the activity",
            message: `Activity ${updateData.id} not found`
        });
    } else if (updatedActivity.error) {
        res.send({
            name: "Error",
            error: updatedActivity.error,
            message: `An activity with name ${req.body.name} already exists`
        })
    } else {
        res.send(updatedActivity)
    }
});

module.exports = activitiesRouter;
