import {MaterialsType} from "../models/material-model";
import {TaskType} from "../models/taskModel";

const categoryModel = require('../models/categories-model');
const materialModel = require('../models/material-model');
const taskModel = require('../models/taskModel');

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
}

module.exports = new ContentService();