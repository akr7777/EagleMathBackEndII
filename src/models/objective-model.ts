import {Schema, model} from 'mongoose';

export type ObjectiveModelType = {
    title: string,
    contentId: string,
    content: string,
    answer: string,
    picture?: any,
}

const ObjectiveSchema = new Schema({
    title: {type: String, required: true, default: ''},
    contentId: {type: String, required: true, default: ''},
    content: {type: String, required: true, default: ''},
    answer: {type: String, required: true, default: ''},
    picture: {type: String, required: true, default: ''}
});

module.exports = model('Objective', ObjectiveSchema);