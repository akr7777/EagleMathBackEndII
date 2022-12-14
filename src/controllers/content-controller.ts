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
            if (result)
                res.json(result);
            else
                res.json({resultCode: resultCodes.Error});
        } else {
            res.json({resultCode: resultCodes.Error});
        }
    }

    async getContentImage(req: Request, res: Response, next: NextFunction) {
        const {name} = req.query;
        const file = await contentService.getContentImageFile(name);
        if (file)
            res.sendFile(file);
        else
            res.json({resultCode: resultCodes.Error})
    }

    async renameContent(req: Request, res: Response, next: NextFunction) {
        const {contentId, newName} = req.body;
        const result = await contentService.renameContent(contentId, newName);
        res.json(result);
    }

    async changeParentId(req: Request, res: Response, next: NextFunction) {
        const {contentId, newParentId} = req.body;
        const result = await contentService.changeParentId(contentId, newParentId);
        res.json(result);
    }

    async deleteContent(req: Request, res: Response, next: NextFunction) {
        const {contentId} = req.body;
        const result = await contentService.deleteContent(contentId);
        res.json(result);
    }

    /*async getContentType(req: Request, res: Response, next: NextFunction) {
        const {contentId} = req.body;
        const result = await contentService.getContentType(contentId);
        res.json(result);
    }*/

    async addMaterial(req: Request, res: Response, next: NextFunction) {
        const {parentContentId} = req.body;
        const result = await contentService.addMaterial(parentContentId);
        res.json(result);
    }

    async addTask(req: Request, res: Response, next: NextFunction) {
        const {parentContentId} = req.body;
        const result = await contentService.addTask(parentContentId);
        res.json(result);
    }

    async addCategory(req: Request, res: Response, next: NextFunction) {
        const {parentContentId} = req.body;
        const result = await contentService.addCategory(parentContentId);
        res.json(result);
    }

    async deleteCategory(req: Request, res: Response, next: NextFunction) {
        const {contentId} = req.body;
        const result = await contentService.deleteCategory(contentId);
        res.json(result);
    }

    async moveParagraph(req: Request, res: Response, next: NextFunction) {
        const {contentId, elementIndex, direction} = req.body;
        const result = await contentService.moveParagraph(contentId, elementIndex, direction);
        res.json(result);
    }

    async studiedMaterials(req: Request, res: Response, next: NextFunction) {
        const {userId} = req.body;
        const result = await contentService.studiedMaterials(userId);
        res.json(result);
    }
    async getFullStudiedContent(req: Request, res: Response, next: NextFunction) {
        const {userId} = req.body;
        const result = await contentService.getFullStudiedContent(userId);
        //console.log('content-controller / getFullStudiedContent / userId, result=', userId, result)
        res.json(result);
    }
    async setMaterialStudied(req: Request, res: Response, next: NextFunction) {
        const {userId, contentId, value} = req.body;
        const result = await contentService.setMaterialStudied(userId, contentId, value);
        //console.log('content-controller / isMaterialStudied / result=', result)
        res.json(result);
    }

    async getContentTitleById(req: Request, res: Response, next: NextFunction) {
        const {contentId} = req.body;
        const result = await contentService.getContentTitleById(contentId);
        res.json(result);
    }

}

module.exports = new ContentController();