import {Schema, model} from 'mongoose';

export type TestModelType = {
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
    contentId: {type: String, required: true, default: '0'},
    content: {type: Array, required: true, default: []}
});

module.exports = model('Test', TestSchema);