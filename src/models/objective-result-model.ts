import {Schema, model} from 'mongoose';

export type ObjectiveResultType = {
    userId: string,
    objectiveId: string,
    title: string
    content: string,
    answer: string,
    result: string,
    date: string,
}

const ObjectiveResultSchema = new Schema({
    userId: {type: String, required: true, default: ''},
    objectiveId: {type: String, required: true, default: ''},
    title: {type: String, required: true, default: ''},
    content: {type: String, required: true, default: ''},
    answer: {type: String, required: true, default: ''},
    result: {type: String, required: true, default: ''},
    date: {type: String, required: true, default: ''},
});

module.exports = model('ObjectiveResult', ObjectiveResultSchema);