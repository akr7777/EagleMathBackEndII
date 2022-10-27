import {DescriptionContactDataType} from "../models/description-contact-model";
import fs from "fs";
const dcModel = require('../models/description-contact-model');


type NewContactInfoType = {
    description:string, email:string, phone:string, skype:string, telegram:string, title:string, whatsapp:string
}

class DescriptionContactService {
    async getDescription() {
        const data:DescriptionContactDataType = await dcModel.findOne();
        return { title: data.descriptionTitle, description: data.descriptionContent };
    }

    async setDescription(title: string, description: string) {
        try {
            const content = await dcModel.findOne();
            content.descriptionTitle = title;
            content.descriptionContent = description;
            content.save();
            return {title: content.descriptionTitle, description: content.descriptionContent};
        } catch (e) {
            console.log(e);
        }
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


    async setContacts(newContactInfo:NewContactInfoType) {
        try {
            //    description:string, email:string, phone:string, skype:string, telegram:string, title:string, whatsapp:string
            console.log('descr-cont service / setContacts/newContactInfo=', newContactInfo)
            const newContacts = await dcModel.findOne();
            if (newContacts) {
                newContacts.contactsTitle = newContactInfo.title || "";
                newContacts.contactsDescription = newContactInfo.description || "";
                newContacts.contactsPhone = newContactInfo.phone || "";
                newContacts.contactsTelegram = newContactInfo.telegram || "";
                newContacts.contactsWhatsApp = newContactInfo.whatsapp || "";
                newContacts.contactsSkype = newContactInfo.skype || "";
                newContacts.contactsEmail = newContactInfo.email || "";
                newContacts.save();
                return {
                    title: newContactInfo.title,
                    description: newContactInfo.description,
                    phone: newContactInfo.phone,
                    telegram: newContactInfo.telegram,
                    whatsapp: newContactInfo.whatsapp,
                    email: newContactInfo.email,
                    skype: newContactInfo.skype,
                }
            } else {
                return {error: "запись не найдена в БД"}
            }
        } catch (e) {
            console.log(e)
        }
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

    async setDescriptionPhoto(file: any) {
        //Ищем старое фото и удаляем его
        const descrPhoto = process.env.INIT_CWD + '' +process.env.MAIN_PHOTO;
        if (process.env.IMAGE_EXTS) {
            process.env.IMAGE_EXTS.split('/').forEach(ext => {
                if (fs.existsSync(descrPhoto + '.' + ext)) {
                    fs.unlink(descrPhoto + '.' + ext, err => {
                        if (err) throw err; // не удалось удалить файл
                        console.log('Файл успешно удалён');
                    })
                }
            })
        }
        //Записываем на место старого фото новое фото с новым расширением
        try {
            const arr = file.name.split('.');
            const fileExtension = arr[arr.length-1];
            await file.mv(process.env.INIT_CWD + '' + process.env.MAIN_PHOTO + '.' + fileExtension);
        } catch (e) {
            console.log('FILE!!! e= ',e)
        }
    }

}

module.exports = new DescriptionContactService();