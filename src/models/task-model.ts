import {Schema, model} from 'mongoose';

export type TaskType = {
    _id: string,
    label: string,
    parentId: string,
    content: string,
}
const TaskSchema = new Schema({
    label: {type: String, required: true},
    parentId: {type: String, required: true, default: '0'},
    content: {type: String, required: true, default: ''}
});

module.exports = model('Task', TaskSchema);