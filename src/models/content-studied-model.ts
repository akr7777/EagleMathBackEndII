import {Schema, model} from 'mongoose';

export type ContentStudiedModelType = {
    userID: string,
    contentId: string,
    isStudied: boolean
}

const ContentStudiedSchema = new Schema({
    userId: {type: String, required: true, default: ''},
    contentId: {type: String, required: true, default: ''},
    isStudied: {type: Boolean, required: true, default: false}
});

module.exports = model('ContentStudied', ContentStudiedSchema);