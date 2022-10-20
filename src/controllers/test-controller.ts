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
        const {title, contentId, content} = req.body;
        const test = await testService.addTest(title, contentId, content);
        res.json(test);
    }

    async correctTest(req: Request, res: Response, next: NextFunction) {
        const {title, contentId, content} = req.body;
        const test = await testService.correctTest(title, contentId, content);
        res.json(test);
    }

    async setTestResults(req: Request, res: Response, next: NextFunction) {
        const {userId, testId, title, result, protocol, date} = req.body;
        const test = await testService.setTestResults(userId, testId, title, result, protocol, date);
        res.json(test);
    }

    async getAllTestsContentIds(req: Request, res: Response, next: NextFunction) {
        const test = await testService.getAllTestsContentIds();
        res.json(test);
    }

    async addNewTestToDataBase(req: Request, res: Response, next: NextFunction) {
        const {title, contentId, content} = req.body;
        const test = await testService.addNewTestToDataBase(title, contentId, content);
        res.json(test);
    }

    async editTestInDataBase(req: Request, res: Response, next: NextFunction) {
        const {testId, title, contentId, content} = req.body;
        const test = await testService.editTestInDataBase(testId, title, contentId, content);
        res.json(test);
    }

    async getTestResultsByUserId(req: Request, res: Response, next: NextFunction) {
        const {userId} = req.body;
        const test = await testService.getTestResultsByUserId(userId);
        res.json(test);
    }
}

module.exports = new TestController();
