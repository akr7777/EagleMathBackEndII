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

    async getDescriptionPhoto(req: Request, res: Response, next: NextFunction) {
        console.log('Descr contacts Controller getDescriptionPhoto')
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

    async getContacts(req: Request, res: Response, next: NextFunction) {
        const contacts = await dcService.getContacts();
        if (contacts) {
            res.json({ ...contacts, resultCode: resultCodes.Success});
        } else {
            res.json({resultCode: resultCodes.Error});
        }
    }
}

module.exports = new DescriptionContectController();
