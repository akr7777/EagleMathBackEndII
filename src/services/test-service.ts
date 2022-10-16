import {OneTestType} from "../models/test-model";

const testModel = require('../models/test-model');
const resultCodes = require('../utils/resultCodes');

class TestService {

    async getTest(contentId: string) {
        try {
            const test = await testModel.findOne({contentId: contentId});
            if (test)
                return {
                    testId: test._id,
                    contentId: test.contentId,
                    content: test.content,
                    resultCode: resultCodes.Success
                };
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

}

module.exports = new TestService();