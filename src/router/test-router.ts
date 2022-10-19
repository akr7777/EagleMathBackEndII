import {Router} from "express";
const testController = require("../controllers/test-controller");

const router = Router();

router.get('/getTest', testController.getTest);
router.post('/addTest', testController.addTest);
router.post('/correctTest', testController.correctTest);

router.post('/setTestResults', testController.setTestResults);

router.get('/getAllTestsContentIds', testController.getAllTestsContentIds);
router.post('/addNewTestToDataBase', testController.addNewTestToDataBase);
router.post('/editTestInDataBase', testController.editTestInDataBase)

module.exports = router;