import { Request, Response, NextFunction } from 'express';
const dcService = require('../services/description-contact-service');
const resultCodes = require("../utils/resultCodes");

class DescriptionContectController {
    async getDescription(req: Request, res: Response, next: NextFunction) {
        const description = await dcService.getDescription();
        //console.log('description:', description)
        if (description) {
            res.json({ ...description, resultCode: resultCodes.Success});
        } else {
            res.json({resultCode: resultCodes.Error});
        }
    }

    async setDescription(req: Request, res: Response, next: NextFunction) {
        const {title, description} = req.body;
        const newDescription = await dcService.setDescription(title, description);
        if (newDescription) {
            res.json({...newDescription, resultCode: resultCodes.Success});
        } else {
            res.json({resultCode: resultCodes.Error});
        }
    }

    async getDescriptionPhoto(req: Request, res: Response, next: NextFunction) {
        try {
            const descriptionPhotoFile = dcService.getDescriptionPhoto();
            //console.log('descriptionPhotoFile=',descriptionPhotoFile)
            res.statusCode = 200;
            res.setHeader("Content-Type", "image/jpeg");
            require("fs").readFile(descriptionPhotoFile, (err:any, image:any) => {
                res.end(image);
            });
        }
        catch (e) {
            next(e);
        }
    }

    async setDescriptionPhoto(req: Request, res: Response, next: NextFunction) {
        try {
            let file;
            if (req.files && req.files.file)
                file = req.files.file;
            if (file) {
                await dcService.setDescriptionPhoto(file);
                res.json({resultCode: resultCodes.Success})
            } else {
                res.json( {resultCode: resultCodes.Error} )
            }
        } catch (e) {
            next(e)
        }
    }

    async getContacts(req: Request, res: Response, next: NextFunction) {
        const contacts = await dcService.getContacts();
        if (contacts) {
            res.json({ ...contacts, resultCode: resultCodes.Success});
        } else {
            res.json({resultCode: resultCodes.Error});
        }
    }

    async setContacts(req: Request, res: Response, next: NextFunction) {
        const contacts = await dcService.setContacts(req.body);
        if (contacts) {
            res.json({ ...contacts, resultCode: resultCodes.Success});
        } else {
            res.json({resultCode: resultCodes.Error});
        }
    }
}

module.exports = new DescriptionContectController();
