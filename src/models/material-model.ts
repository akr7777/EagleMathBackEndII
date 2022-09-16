import {Schema, model} from 'mongoose';

export type MaterialsType = {
    _id: string,
    label: string,
    parentId: string,
    content: string,
}
const MaterialSchema = new Schema({
    label: {type: String, required: true},
    parentId: {type: String, required: true, default: '0'},
    content: {type: String, required: true, default: ''}
});

module.exports = model('Material', MaterialSchema);