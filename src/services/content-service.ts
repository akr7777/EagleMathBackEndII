import {MaterialsType} from "../models/material-model";
import {TaskType} from "../models/taskModel";
//import {ObjectId} from "mongodb";
const ObjectId = require('mongodb').ObjectId;
//import {FavoriteContentModelType} from "../models/favorite-content-model";

const categoryModel = require('../models/categories-model');
const materialModel = require('../models/material-model');
const taskModel = require('../models/taskModel');
const favoriteContentModel = require('../models/favorite-content-model');

class ContentService {
    async getAllCategories() {
        //const categories = categoryModel.find();
        //const categoriesDto = new CategoryDto(categories);
        return categoryModel.find();
    }

    async getAllMaterials() {
        const result:Array<{id: string, label: string, parentId: string}> = [];

        result.forEach(d => d);

        const materials:Array<MaterialsType> = await materialModel.find();
        //console.log('ContentService / getAllMaterials / materials= ', materials)
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
        //console.log('ContentService / getAllTasks / tasks= ', tasks)
        if (tasks) {
            tasks.forEach( (d:TaskType) => {
                result.push({
                    id: d._id,
                    label: d.label,
                    parentId: d.parentId
                });
            })
        }

        //console.log('ContentService / getAllTasks / result= ', result)
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
        const taskContent:TaskType = await taskModel.findOne({_id: ObjectId(contentId)});
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
        }
    }

}

module.exports = new ContentService();