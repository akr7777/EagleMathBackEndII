import {MaterialsType} from "../models/material-model";
import {TaskType} from "../models/task-model";
import {ContentType} from "../models/content-model";
const ObjectId = require('mongodb').ObjectId;

const categoryModel = require('../models/categories-model');
const materialModel = require('../models/material-model');
const taskModel = require('../models/task-model');
const favoriteContentModel = require('../models/favorite-content-model');

const contentModel = require('../models/content-model');
const resultCodes = require('../utils/resultCodes');

class ContentService {
    async getAllCategories() {
        return categoryModel.find();
    }

    async getAllMaterials() {
        const result:Array<{id: string, label: string, parentId: string}> = [];

        result.forEach(d => d);

        const materials:Array<MaterialsType> = await materialModel.find();
        if (materials) {
            materials.forEach( (d:MaterialsType) => {
                result.push({
                    id: d._id,
                    label: d.label,
                    parentId: d.parentId
                });
            })
        }

        return result;
    }

    async getAllTasks() {
        const result:Array<{id: string, label: string, parentId: string}> = [];

        const tasks:Array<TaskType> = await taskModel.find();
        if (tasks) {
            tasks.forEach( (d:TaskType) => {
                result.push({
                    id: d._id,
                    label: d.label,
                    parentId: d.parentId
                });
            })
        }

        return result;
    }

    async getFavoriteContent(userId: string) {
        const result = await favoriteContentModel.findOne({userId: userId});
        if (result)
            return result.favorites;
        else
            return []
    }
    async addContentToFavorites(userId: string, contentId: string) {
        const f = await favoriteContentModel.findOne({userId: userId});
        f.favorites.push(contentId);
        f.save();
        return f.favorites;
    }
    async deleteContentFromFavorites(userId: string, contentId: string) {
        const f = await favoriteContentModel.findOne({userId: userId});
        f.favorites = f.favorites.filter( (cid:string) => cid !== contentId);
        f.save();
        return f.favorites;
    }

    async getContent(contentId: string) {
        /*const taskContent:TaskType = await taskModel.findOne({_id: ObjectId(contentId)});
        if (!taskContent) {
            const materialContent:MaterialsType = await materialModel.findOne({_id: ObjectId(contentId)});
            return {
                title: materialContent.label,
                content: materialContent.content,
            }
        }
        return {
            title: taskContent.label,
            content: taskContent.content,
        }*/
        //const content:ContentType = await contentModel.findOne({_id: ObjectId(contentId)});
        const data:ContentType = await contentModel.findOne({contentId: contentId});
        if (data) {
            return {
                /*contentId: content.contentId,
                index: content.index,
                type: content.type,
                content: content.content,*/
                content: data.content,
                resultCode: resultCodes.Success,
            }
        } else {
                return {
                    content: [],
                    resultCode: resultCodes.Error
                }
            }
    }

    async setContent (newContent: {content: Array<ContentType>, contentId: string}) {
        /*for (let i=0; i<newContent.length; i++) {
            const content = await contentModel.findOne({_id: ObjectId(newContent[i].contentId), index: newContent[i].index});
            if (content) {
                content.contentId = newContent[i].contentId;
                content.type = newContent[i].type;
                content.index = newContent[i].index;
                content.content = newContent[i].content;
                content.save();
            } else {
                await contentModel.create({
                    contentId: newContent[i].contentId,
                    index: newContent[i].index,
                    type: newContent[i].type,
                    content: newContent[i].content,
                });
            }
        }*/
        //const content:ContentType = await contentModel.findOne({_id: ObjectId(newContent.contentId)});

        //console.log('newContent=', newContent)

        const data = await contentModel.findOne({contentId: newContent.contentId});
        if (data) {
            data.contentId = newContent.contentId;
            data.content = newContent.content;
            data.save();
            return {
                content: data.content,
                resultCode: resultCodes.Success,
            }
        } else {
            const result = await contentModel.create({
                content: newContent.content,
                contentId: newContent.contentId
            });
            return {
                content: newContent.content,
                resultCode: resultCodes.Success,

            }
        }
        //return { resultCode: resultCodes.Error }
    }

}

module.exports = new ContentService();