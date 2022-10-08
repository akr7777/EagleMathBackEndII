import {NoteDataType} from "../models/notes-model";
import {log} from "util";
const notesModel = require("../models/notes-model")
const resultCodes = require('./../utils/resultCodes');

class NotesService {
    async getNotes(userId: string) {
        //console.log('NotesService / getNotes / userId=', userId)
        try {
            const userNotes = await notesModel.findOne({userId: userId});
            if (!userNotes)
                return { resultCode: resultCodes.Error }
            return {
                userId: userNotes.userId,
                notes: userNotes.notes,
                resultCode: resultCodes.Success
            }
        } catch (e) {
            console.log('getNotes Error = ', e)
        }
    }

    async setNotes(userId: string, notesArray: Array<NoteDataType>) {
        try {
            const userNotes = await notesModel.findOne({userId: userId});
            if (userNotes) {
                if (notesArray)
                    userNotes.notes = notesArray;
                await userNotes.save();
                return { notes: userNotes.notes, resultCode: resultCodes.Success}
            } else {
                const notes = await notesModel.create({
                    userId: userId,
                    notes: notesArray
                });
                return { notes: notes.notes, resultCode: resultCodes.Success}
            }
            return { resultCode: resultCodes.Error }

        } catch (e) {
            console.log('getNotes Error = ', e)
        }
    }


    async changeNoteStatus(userId: string, noteId: string, newStatus: boolean) {
        try {
            const userNotes = await notesModel.findOne({userId: userId});
            if (userNotes) {
                userNotes.notes = userNotes.notes.map( (note:NoteDataType) => {
                    if (note.noteId === noteId)
                        note = {...note, isActive: newStatus}
                    return note
                });
                await userNotes.save();
                return { notes: userNotes.notes, resultCode: resultCodes.Success}
            }
            return { resultCode: resultCodes.Error }

        } catch (e) {
            console.log('getNotes Error = ', e)
        }
    }


    async deleteNote(userId: string, noteId: string) {
        try {
            const userNotes = await notesModel.findOne({userId: userId});
            if (userNotes) {
                userNotes.notes = userNotes.notes.filter( (note:NoteDataType) => note.noteId !== noteId)
                await userNotes.save();
                return { notes: userNotes.notes, resultCode: resultCodes.Success}
            }
            return { resultCode: resultCodes.Error }
        } catch (e) {
            console.log('getNotes Error = ', e)
        }
    }

    async changeNoteTitle(userId: string, noteId: string, newTextTitleValue: string) {
        try {
            const userNotes = await notesModel.findOne({userId: userId});
            if (userNotes) {
                userNotes.notes = userNotes.notes.map( (note:NoteDataType) => {
                    if (note.noteId === noteId)
                        note = {...note, title: newTextTitleValue}
                    return note
                });
                await userNotes.save();
                return { notes: userNotes.notes, resultCode: resultCodes.Success}
            }
            return { resultCode: resultCodes.Error }

        } catch (e) {
            console.log('getNotes Error = ', e)
        }
    }

    async changeNoteText(userId: string, noteId: string, newTextTitleValue: string) {
        try {
            const userNotes = await notesModel.findOne({userId: userId});
            if (userNotes) {
                userNotes.notes = userNotes.notes.map( (note:NoteDataType) => {
                    if (note.noteId === noteId)
                        note = {...note, text: newTextTitleValue}
                    return note
                });
                await userNotes.save();
                return { notes: userNotes.notes, resultCode: resultCodes.Success}
            }
            return { resultCode: resultCodes.Error }

        } catch (e) {
            console.log('getNotes Error = ', e)
        }
    }
}

module.exports = new NotesService();