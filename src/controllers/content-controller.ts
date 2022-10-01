import {Request, Response, NextFunction} from 'express';

const resultCodes = require("../utils/resultCodes");
const contentService = require('../services/content-service');

class ContentController {
    async getAllCategories(req: Request, res: Response, next: NextFunction) {
        const categories = await contentService.getAllCategories();
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

    async getFavoritesContent(req: Request, res: Response, next: NextFunction) {
        const {userId} = req.body;
        const favorites = await contentService.getFavoriteContent(userId);
        res.json(favorites);
    }

    async addContentToFavorites(req: Request, res: Response, next: NextFunction) {
        const {userId, contentId} = req.body;
        const userFavoriteMaterials = await contentService.addContentToFavorites(userId, contentId);
        res.json(userFavoriteMaterials);
    }

    async deleteContentFromFavorites(req: Request, res: Response, next: NextFunction) {
        const {userId, contentId} = req.body;
        const userFavoriteMaterials = await contentService.deleteContentFromFavorites(userId, contentId);
        res.json(userFavoriteMaterials);
    }

    async getContent(req: Request, res: Response, next: NextFunction) {
        const {contentId} = req.params;
        const content = await contentService.getContent(contentId);
        res.json(content);
    }

    async setContent(req: Request, res: Response, next: NextFunction) {
        const newContent = req.body;
        const result = await contentService.setContent(newContent);
        res.json(result);
    }

    async setContentImage(req: Request, res: Response, next: NextFunction) {
        const {fileName} = req.body;
        let file;
        if (req.files && req.files.file)
            file = req.files.file;
        if (file) {
            const result = await contentService.setContentImage(file, fileName);
            res.json(result);
        } else {
            res.json({resultCode: resultCodes.Error});
        }
    }

    async getContentImage(req: Request, res: Response, next: NextFunction) {
        const {name} = req.query;
        const file = await contentService.getContentImageFile(name);
        console.log('content-controller / getContentImage/ file=', file)
        res.sendFile(file);
    }

}

module.exports = new ContentController();