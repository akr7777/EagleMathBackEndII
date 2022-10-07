import { Request, Response, NextFunction } from 'express';
const resultCodes = require("../utils/resultCodes");
const notesService = require('../services/notes-service');

class NotesController {
    async getNotes(req: Request, res: Response, next: NextFunction) {
        const {userId} = req.body;
        const notes = await notesService.getNotes(userId);
        res.json(notes);
    }

    async setNotes(req: Request, res: Response, next: NextFunction) {
        const {userId, notes} = req.body;
        const result = await notesService.setNotes(userId, notes);
        res.json(result);
    }
}

module.exports = new NotesController();
