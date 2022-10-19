import {Schema, model} from 'mongoose';

export type TestModelType = {
    title: string,
    contentId: string,
    content: Array<OneTestType>
}
export type OneTestType = {
    questionId: string,
    question: string,
    options: Array<any>,
    answer: string,
}

const TestSchema = new Schema({
    title: {type: String, required: true, default: ''},
    contentId: {type: String, required: true, default: ''},
    content: {type: Array, required: true, default: []}
});

module.exports = model('Test', TestSchema);