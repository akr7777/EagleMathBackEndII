import {OneTestType} from "../models/test-model";
import {TestResultModelType} from "../models/test-result-model";

const testModel = require('../models/test-model');
const testResultModel = require("../models/test-result-model");
const resultCodes = require('../utils/resultCodes');

class TestService {

    async getTest(contentId: string) {
        //console.log('TestService/getTest/contentId=', contentId)
        try {
            const test = await testModel.findOne({contentId: contentId});
            if (test) {
                //console.log('TestService/getTest/returning test=', test);
                return {
                    testId: test._id,
                    contentId: test.contentId,
                    content: test.content,
                    resultCode: resultCodes.Success
                };
            }
            else
                return {resultCode: resultCodes.Error}
        } catch (e) {
            console.log('test-service / getTest / error = ', e);
            return {resultCode: resultCodes.Error};
        }
    }

    async addTest(contentId: string, content: Array<OneTestType>) {
        const result = await testModel.create({contentId, content});
        return {result, resultCode: resultCodes.Success};
    }

    async correctTest(contentId: string, content: Array<OneTestType>) {
        const test = await testModel.findOne({contentId: contentId});
        if (test) {
            test.content = [...content];
            await test.save();
            return {
                testId: test._id,
                contentId: test.contentId,
                content: test.content,
                resultCode: resultCodes.Success
            }
        } else
            return {resultCode: resultCodes.Error};
    }

    async setTestResults(userId: string, testId: string, result: number, protocol: Array<TestResultModelType>, date: string) {
        try {
            if (userId && testId && protocol && date)
                await testResultModel.create({
                    userId: userId,
                    testId: testId,
                    result: result,
                    protocol: protocol,
                    date: date,
                });
            return {resultCode: resultCodes.Success};
        } catch (e) {
            console.log('test-service / setTestResults / error = ', e);
            return {resultCode: resultCodes.Error};
        }
    }

}

module.exports = new TestService();