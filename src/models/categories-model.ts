import {Schema, model} from 'mongoose';

const CategorySchema = new Schema({
    label: {type: String, required: true},
    parentId: {type: String, required: true, default: '0'}
});

module.exports = model('Category', CategorySchema);