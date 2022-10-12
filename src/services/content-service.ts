import {MaterialsType} from "../models/material-model";
import {TaskType} from "../models/task-model";
import {ContentType} from "../models/content-model";
import fs from "fs";
import {v4} from "uuid";
const ObjectId = require('mongodb').ObjectId;

const categoryModel = require('../models/categories-model');
const materialModel = require('../models/material-model');
const taskModel = require('../models/task-model');
const favoriteContentModel = require('../models/favorite-content-model');

const contentModel = require('../models/content-model');
const resultCodes = require('../utils/resultCodes');

class ContentService {
    async getAllCategories() {
        const response = await categoryModel.find();
        return response;
    }

    async getAllMaterials() {
        const result:Array<{id: string, label: string, parentId: string}> = [];

        //result.forEach(d => d);

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
        const data:ContentType = await contentModel.findOne({contentId: contentId});
        if (data) {
            return {
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

    async setContentImage(file: any, fileName: string) {
        //const data = await contentModel.findOne({contentId: contentId});
        const path = process.env.INIT_CWD + "" + process.env.PATH_TO_CONTENT + fileName;
        console.log('content-servoce / setContentImage / path=', path);

        try {
            await file.mv(path);
            return resultCodes.Success;
        } catch (e) {
            console.log("content-service / setContentImage / error = ", e);
            return resultCodes.Error;
        }
    }

    async getContentImageFile(fileName: string) {
        const file = process.env.INIT_CWD + "" + process.env.PATH_TO_CONTENT + fileName;
        if (fs.existsSync(file))
            return file;
    }

    async renameContent(contentId: string, newName: string) {
        let cont = await materialModel.findOne({_id: contentId});
        if (cont) {
            cont.label = newName;
            cont.save();
            return resultCodes.Success;
        } else {
            cont = await taskModel.findOne({_id: contentId});
            if (cont) {
                cont.label = newName;
                cont.save();
                return resultCodes.Success;
            } else {
                cont = await categoryModel.findOne({_id: contentId});
                if (cont) {
                    cont.label = newName;
                    cont.save();
                    return resultCodes.Success;
                }
            }

        }
        return resultCodes.Error;
    }

    async changeParentId(contentId: string, newParentId: string) {
        let cont = await materialModel.findOne({_id: contentId});
        if (!cont) cont = await taskModel.findOne({_id: contentId});
        if (!cont) cont = await categoryModel.findOne({_id: contentId});
        if (cont) {
            cont.parentId = newParentId;
            cont.save();
            return resultCodes.Success;
        }
        return resultCodes.Error;
    }

    async deleteContent(contentId: string) {
        const content = await contentModel.findOne({contentId: contentId});
        if (content) {
            let m = await materialModel.findOne({_id: contentId});
            if (!m) m = await taskModel.findOne({_id: contentId});
            //if (!m) m = await categoryModel.findOne({_id: contentId});
            if (m) {
                await materialModel.deleteOne({_id: contentId});
                await taskModel.deleteOne({_id: contentId});
                await contentModel.deleteOne({contentId: contentId});
                return {resultCode: resultCodes.Success};
            }
        }
        return {resultCode: resultCodes.Error};
    }

    /*async getContentType(contentId: string) {
        try {
            const m = await materialModel.findOne({_id: contentId});
            if (m) return {contentType: "Material", resultCode: resultCodes.Success}
            const t = await taskModel.findOne({_id: contentId});
            if (t) return {contentType: "Task", resultCode: resultCodes.Success}
            const c = await categoryModel.findOne({_id: contentId});
            if (c) return {contentType: "Category", resultCode: resultCodes.Success}
            return {contentType: undefined, resultCode: resultCodes.Success}
        } catch (e) {
            console.log('content-service / getContentType / error=', e);
            return { resultCode: resultCodes.Error};
        }
        return { resultCode: resultCodes.Error};
    }*/

    async addMaterial(parentContentId: string) {
        try {
            const newElement = await materialModel.create({
                label: 'Новый метериал: название',
                parentId: parentContentId,
                content: 'Новый материал контент'
            });
            await contentModel.create({
                contentId: newElement._id,
                content: []
            });
            return {resultCode: resultCodes.Success};
        } catch (e) {
            console.log('content-service / addMaterial / error=', e);
            return { resultCode: resultCodes.Error};
        }
        return { resultCode: resultCodes.Error};
    }

    async addTask(parentContentId: string) {
        try {
            const newElement = await taskModel.create({
                label: 'Новая задача: название',
                parentId: parentContentId,
                content: 'Новая задача контент'
            });
            await contentModel.create({
                contentId: newElement._id,
                content: []
            });
            return {resultCode: resultCodes.Success};
        } catch (e) {
            console.log('content-service / addTask / error=', e);
            return { resultCode: resultCodes.Error};
        }
        return { resultCode: resultCodes.Error};
    }

    async addCategory(parentContentId: string) {
        try {
            await categoryModel.create({
                label: 'Новая категория',
                parentId: parentContentId,
            });
            const categories = await categoryModel.find();
            return {categories, resultCode: resultCodes.Success};
        } catch (e) {
            console.log('content-service / addMaterial / error=', e);
            return { resultCode: resultCodes.Error};
        }
        return { resultCode: resultCodes.Error};
    }

    async deleteCategory(contentId: string) {
        try {
            await categoryModel.deleteOne({_id: contentId});
            await taskModel.deleteMany({parentId: contentId});
            await materialModel.deleteMany({parentId: contentId});
            const categories = await categoryModel.find();
            return {categories, resultCode: resultCodes.Success};
        } catch (e) {
            console.log('content-service / addMaterial / error=', e);
            return { resultCode: resultCodes.Error};
        }
        return { resultCode: resultCodes.Error};
    }

}

module.exports = new ContentService();