//const Router = require('express').Router;
import {Router} from "express";
const notesController = require("../controllers/notes-controller");

//const router = new Router();
const router = Router();

router.post('/getNotes', notesController.getNotes);
router.post('/setNotes', notesController.setNotes);

module.exports = router;