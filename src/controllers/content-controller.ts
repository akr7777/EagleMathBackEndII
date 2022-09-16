import { Request, Response, NextFunction } from 'express';
const contentService = require('../services/content-service');

class ContentController {
    async getAllCategories(req: Request, res: Response, next: NextFunction) {
        //console.log('ContentController / getAllCategories')
        const categories = await contentService.getAllCategories();
        //console.log('ContentController / getAllCategories / categories=', categories)
        res.json(categories);
    }

}

module.exports = new ContentController();