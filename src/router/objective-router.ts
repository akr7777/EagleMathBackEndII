import {Router} from "express";
const objectiveController = require("../controllers/objectives-controller");

const router = Router();

router.post('/getObjectiveByContentId', objectiveController.getObjectiveByContentId);
router.post('/addObjective', objectiveController.addObjective);
router.post('/setObjectiveResult', objectiveController.setObjectiveResult);
router.post('/getObjectiveResultsByUserId', objectiveController.getObjectiveResultsByUserId);
router.get('/getObjectiveImage', objectiveController.getObjectiveImage);

module.exports = router;