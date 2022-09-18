import {DescriptionContactDataType} from "../models/description-contact-model";
import fs from "fs";
const dcModel = require('../models/description-contact-model');

class DescriptionContactService {
    async getDescription() {
        const data:DescriptionContactDataType = await dcModel.findOne();
        return { title: data.descriptionTitle, description: data.descriptionContent };
    }

    async getContacts() {
        const data:DescriptionContactDataType = await dcModel.findOne();
        return {
            title: data.contactsTitle,
            description: data.contactsDescription,
            phone: data.contactsPhone,
            telegram: data.contactsTelegram,
            whatsapp: data.contactsWhatsApp,
            email: data.contactsEmail,
            skype: data.contactsSkype,
        };
    }
    getDescriptionPhoto() {
        let photo = process.env.INIT_CWD + '' + process.env.MAIN_PHOTO;
        if (process.env.IMAGE_EXTS) {
            process.env.IMAGE_EXTS.split('/').forEach(ext => {
                if (fs.existsSync(photo+'.'+ext))
                    photo = photo + '.' + ext;
            })
        }
        return photo;
    }
}

module.exports = new DescriptionContactService();