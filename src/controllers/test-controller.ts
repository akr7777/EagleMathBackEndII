import { Request, Response, NextFunction } from 'express';
const resultCodes = require("../utils/resultCodes");
const testService = require('../services/test-service');

class TestController {
    async getTest(req: Request, res: Response, next: NextFunction) {
        const {contentId} = req.query;
        const test = await testService.getTest(contentId);
        res.json(test);
    }

    async addTest(req: Request, res: Response, next: NextFunction) {
        const {contentId, content} = req.body;
        const test = await testService.addTest(contentId, content);
        res.json(test);
    }

    async correctTest(req: Request, res: Response, next: NextFunction) {
        const {contentId, content} = req.body;
        const test = await testService.correctTest(contentId, content);
        res.json(test);
    }

    async setTestResults(req: Request, res: Response, next: NextFunction) {
        const {userId, testId, result, protocol, date} = req.body;
        const test = await testService.setTestResults(userId, testId, result, protocol, date);
        res.json(test);
    }

    async getAllTestsContentIds(req: Request, res: Response, next: NextFunction) {
        const test = await testService.getAllTestsContentIds();
        res.json(test);
    }

    async addNewTestToDataBase(req: Request, res: Response, next: NextFunction) {
        const {contentId, content} = req.body;
        const test = await testService.addNewTestToDataBase(contentId, content);
        res.json(test);
    }
}

module.exports = new TestController();
