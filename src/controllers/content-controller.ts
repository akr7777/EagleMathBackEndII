import { Request, Response, NextFunction } from 'express';
const contentService = require('../services/content-service');

class ContentController {
    async getAllCategories(req: Request, res: Response, next: NextFunction) {
        //console.log('ContentController / getAllCategories')
        const categories = await contentService.getAllCategories();
        //console.log('ContentController / getAllCategories / categories=', categories)
        res.json(categories);
    }

    async getAllMaterials(req: Request, res: Response, next: NextFunction) {
        const materials = await contentService.getAllMaterials();
        res.json(materials);
    }

    async getAllTasks(req: Request, res: Response, next: NextFunction) {
        const tasks = await contentService.getAllTasks();
        res.json(tasks);
    }

}

module.exports = new ContentController();