import {Schema, model} from 'mongoose';

export type DescriptionContactDataType = {
    descriptionTitle: string,
    descriptionContent: string,
    contactsTitle: string,
    contactsDescription: string,
    contactsPhone: string,
    contactsTelegram: string,
    contactsWhatsApp: string,
    contactsEmail: string,
    contactsSkype: string,
}

const DescriptionContactSchema = new Schema({
    descriptionTitle: {type: String, required: true, default: ''},
    descriptionContent: {type: String, required: true, default: ''},

    contactsTitle: {type: String, required: true, default: ''},
    contactsDescription: {type: String, required: true, default: ''},

    contactsPhone: {type: String, required: true, default: ''},
    contactsTelegram: {type: String, required: true, default: ''},
    contactsWhatsApp: {type: String, required: true, default: ''},
    contactsEmail: {type: String, required: true, default: ''},
    contactsSkype: {type: String, required: true, default: ''},

});

module.exports = model('DescriptionContact', DescriptionContactSchema);