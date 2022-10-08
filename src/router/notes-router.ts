//const Router = require('express').Router;
import {Router} from "express";
const notesController = require("../controllers/notes-controller");

//const router = new Router();
const router = Router();

router.post('/getNotes', notesController.getNotes);
router.post('/setNotes', notesController.setNotes);
router.post('/changeNoteStatus', notesController.changeNoteStatus);
router.post('/deleteNote', notesController.deleteNote)

module.exports = router;