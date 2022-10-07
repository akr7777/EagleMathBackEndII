//const {Schema, model} = require('mongoose');
//import {model, Schema} from "../server";
import {Schema, model} from 'mongoose';

export type NoteDataType = {
    noteId: string,
    title: string,
    text: string,
    isActive: boolean,
}
const NotesSchema = new Schema({
    userId: {type: String, unique: true},
    notes: {type: Array, required: true, default: []},
});

module.exports = model('Notes', NotesSchema);