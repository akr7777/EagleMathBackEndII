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
                return { notes: userNotes, resultCode: resultCodes.Success}
            } else {
                const notes = await notesModel.create({
                    userId: userId,
                    notes: notesArray
                });
                return { notes: notes, resultCode: resultCodes.Success}
            }
            return { resultCode: resultCodes.Error }

        } catch (e) {
            console.log('getNotes Error = ', e)
        }
    }
}

module.exports = new NotesService();