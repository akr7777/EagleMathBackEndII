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
}

module.exports = new TestController();
