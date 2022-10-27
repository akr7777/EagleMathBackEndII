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
        let file;
        if (req.files && req.files.picture) file = req.files.picture;
        const test = await objectivesService.addObjective({data: req.body, file: file});
        res.json(test);
    }
    async setObjectiveResult(req: Request, res: Response, next: NextFunction) {
        const test = await objectivesService.setObjectiveResult(req.body);
        res.json(test);
    }
    async getObjectiveResultsByUserId(req: Request, res: Response, next: NextFunction) {
        const {userId} = req.body;
        const test = await objectivesService.getObjectiveResultsByUserId(userId);
        res.json(test);
    }

    async getObjectiveImage(req: Request, res: Response, next: NextFunction) {
        const {name} = req.query;
        console.log('objective controller / getObjectiveImage / name = ', name)
        const file = await objectivesService.getObjectiveImage(name);
        if (file)
            res.sendFile(file);
        else
            res.json({resultCode: resultCodes.Error})
    }

}

module.exports = new objectiveController();
