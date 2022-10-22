import { Request, Response, NextFunction } from 'express';
const resultCodes = require("../utils/resultCodes");
const objectivesService = require('../services/objectives-service');

class objectiveController {
    async getObjectiveByContentId(req: Request, res: Response, next: NextFunction) {
        const {contentId} = req.body;
        const test = await objectivesService.getObjectiveByContentId(contentId);
        res.json(test);
    }
    async addObjective(req: Request, res: Response, next: NextFunction) {
        const test = await objectivesService.addObjective(req.body);
        res.json(test);
    }
    async setObjectiveResult(req: Request, res: Response, next: NextFunction) {
        const test = await objectivesService.setObjectiveResult(req.body);
        res.json(test);
    }

}

module.exports = new objectiveController();
