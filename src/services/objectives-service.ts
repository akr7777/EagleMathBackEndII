import {OneTestType, TestModelType} from "../models/test-model";
import {TestResultModelType} from "../models/test-result-model";
import {ObjectiveModelType} from "../models/objective-model";
import {ObjectiveResultType} from "../models/objective-result-model";
import fs from "fs";

const objectiveModel = require('../models/objective-model');
//const testResultModel = require("../models/test-result-model");
const resultCodes = require('../utils/resultCodes');
const objectiveResult = require('../models/objective-result-model');


type AddObjectivePropsType = { data: ObjectiveModelType, file: any }

class ObjectivesService {
    async getObjectiveByContentId (contentId: string) {
        try {
            const objectives = await objectiveModel.find({contentId: contentId});
            if (objectives)
                return {objectives: objectives, resultCode: resultCodes.Success}
            else
                return {resultCode: resultCodes.Error}
        } catch (e) {
            console.log('ObjectivesService / getObjectives / error = ', e);
            return {resultCode: resultCodes.Error}
        }
    }

    async setObjectiveImage(file: any, fileName: string) {
        const path = process.env.INIT_CWD + "" + process.env.PATH_TO_OBJECTIVE_IMAGES + fileName;
        try {
            await file.mv(path);
            return resultCodes.Success;
        } catch (e) {
            console.log("objective-service / setObjectiveImage / error = ", e);
            return resultCodes.Error;
        }
    }

    async getObjectiveImage(fileName: string) {
        const file = process.env.INIT_CWD + "" + process.env.PATH_TO_OBJECTIVE_IMAGES + fileName;
        if (fs.existsSync(file))
            return file;
        else return false;
    }

    async addObjective (props: AddObjectivePropsType) {
        //console.log('objective-service / addObjective / props=', props)
        try {
            const newObjective = await objectiveModel.create({
                title: props.data.title,
                contentId: props.data.contentId,
                content: props.data.content,
                answer: props.data.answer,
                picture: '',
            });

            if (props.file) {
                //создаем для файла новое имя
                const nameSplited = props.file.name.split('.');
                const ext = nameSplited[nameSplited.length - 1];
                const newFileName = newObjective._id + "." + ext;
                //Сохраняем файл в нужную папку
                await this.setObjectiveImage(props.file, newFileName)
                //вносим изменения в БД
                newObjective.picture = newFileName;
                await newObjective.save();
            }
            //создаем response
            const allObjectives = await this.getObjectiveByContentId(props.data.contentId);
            return allObjectives;
        } catch (e) {
            console.log('ObjectivesService / getObjectives / error = ', e);
            return {resultCode: resultCodes.Error}
        }
    }

    async setObjectiveResult (data: ObjectiveResultType) {
        try {
            await objectiveResult.create({...data});
            return { resultCode: resultCodes.Success }
        } catch (e) {
            console.log('objective-service / setObjectiveResult / error =', e);
            return { resultCode: resultCodes.Error }
        }
    }

    async getObjectiveResultsByUserId (userId: string) {
        try {
            const objectiveResults = await objectiveResult.find({userId: userId});
            return { objectiveResults: objectiveResults, resultCode: resultCodes.Success }
        } catch (e) {
            console.log('objective-service / setObjectiveResult / error =', e);
            return { resultCode: resultCodes.Error }
        }
    }
}

module.exports = new ObjectivesService();