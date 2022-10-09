import {Schema, model} from 'mongoose';

export type ContentType = {
    contentId: string,
    type: "Title" | "Text" | "Image",
    content: string,
}
export type ContentLineType = {
    //_id: string,
    contentId: string,
    //index: number,
    //type: "Title" | "Text" | "Image",
    content: Array<ContentType>,
}

const ContentSchema = new Schema({
    contentId: {type: String, required: true},
    //index: {type: Number, required: true},
    //type: {type: String, required: true},
    content: {type: Array, required: true, default: []}
});

module.exports = model('Content', ContentSchema);