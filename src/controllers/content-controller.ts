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

    async getFavoritesContent(req: Request, res: Response, next: NextFunction) {
        const {userId} = req.body;
        console.log('content controller / getFavoritesContent, userId=', userId)
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

}

module.exports = new ContentController();