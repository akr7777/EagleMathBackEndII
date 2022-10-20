import {Schema, model} from 'mongoose';
import {OneTestType} from "./test-model";

export type TestResultModelType = {
    userId: string,
    testId: string,
    title: string,
    result: number,
    protocol: Array< OneTestType & { receivedAnswer: string } >,
    date: string,
}
const TestResultSchema = new Schema({
    userId: {type: String, required: true, default: '0'},
    testId: {type: String, required: true, default: '0'},
    title: {type: String, required: true, default: '0'},
    result: {type: Number, required: true, default: 0},
    protocol: {type: Array, required: true, default: []},
    date: {type: String, required: true, default: '0'},
});

module.exports = model('TestResult', TestResultSchema);