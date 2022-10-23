import {OneTestType, TestModelType} from "../models/test-model";
import {TestResultModelType} from "../models/test-result-model";
import {ObjectiveModelType} from "../models/objective-model";
import {ObjectiveResultType} from "../models/objective-result-model";

const objectiveModel = require('../models/objective-model');
//const testResultModel = require("../models/test-result-model");
const resultCodes = require('../utils/resultCodes');
const objectiveResult = require('../models/objective-result-model');

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

    async addObjective (data: ObjectiveModelType) {
        try {
            const newObjective = await objectiveModel.create({
                title: data.title,
                contentId: data.contentId,
                content: data.content,
                answer: data.answer,
                picture: '',
            });

            if (data.picture) {
                const nameSplited = data.picture.name.split('.');
                const ext = nameSplited[nameSplited.length - 1];
                console.log('objective-service / addObjective / ext=', ext)
                newObjective.picture = newObjective._id + "." + ext;
                await newObjective.save();
            }

            const allObjectives = await this.getObjectiveByContentId(data.contentId);
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