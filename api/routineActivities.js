const express = require('express');
const routineActivitiesRouter = express.Router();
const { getRoutineActivityById } = require('../db');
const { updateRoutineActivity } = require('../db');

// PATCH /api/routine_activities/:routineActivityId - Update the count or duration on the routine activity
routineActivitiesRouter.patch('/routineActivityId', async (req, res, next) => {
    const { routineActivityId } = req.params;
    const { count, duration } = req.body;

    const updateFields = {};

    if (count){
        updateFields.count = count;
    }

    if (duration){
        updateFields.duration = duration;
    }

    try{
        const originalRoutineActivity = await getRoutineActivityById(routineActivityId);

        if(originalRoutineActivity.author.id === req.user.id){
            const updatedRoutineActivity = await updateRoutineActivity(routineActivityId, updateFields);
            res.send({ routineActivity: updatedRoutineActivity})
        } else {
            next({
                name: 'Error',
                message: 'Error'
            })
        }
    } catch ({ name, message}) {
        next ({ name, message})
    }
})

routineActivitiesRouter.delete('/routineActivityId', async (req, res, next) => {
    try {
        const routineActivity = await getRoutineActivityById(req.params.routineActivityId);

        if (routineActivity && routineActivity.author.id === req.user.id) {
            const updatedRoutineActivity = await updateRoutineActivity(routineActivity.id, { active: false });

            res.send({ routineActivity: updatedRoutineActivity });
        } else {
            next(routineActivity ? {
                name: "UnauthorizedUserError",
                message: "You cannot delete a routine_activity which is not yours"
            } : {
                name: "RoutineActivityNotFoundError",
                message: "That routine_activity does not exist"
            });
        }
    } catch ({ name, message }) {
        next ({ name, message })
    }
});


module.exports = routineActivitiesRouter;