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

    async changeNoteStatus(req: Request, res: Response, next: NextFunction) {
        const {userId, noteId, newStatus} = req.body;
        const result = await notesService.changeNoteStatus(userId, noteId, newStatus);
        //console.log('NotesController / changeNoteStatus / result=', result)
        res.json(result);
    }

    async deleteNote(req: Request, res: Response, next: NextFunction) {
        const {userId, noteId} = req.body;
        const result = await notesService.deleteNote(userId, noteId);
        res.json(result);
    }

    async changeNoteTitle(req: Request, res: Response, next: NextFunction) {
        const {userId, noteId, newTextTitleValue} = req.body;
        const result = await notesService.changeNoteTitle(userId, noteId, newTextTitleValue);
        res.json(result);
    }

    async changeNoteText(req: Request, res: Response, next: NextFunction) {
        const {userId, noteId, newTextTitleValue} = req.body;
        const result = await notesService.changeNoteText(userId, noteId, newTextTitleValue);
        res.json(result);
    }
}

module.exports = new NotesController();
