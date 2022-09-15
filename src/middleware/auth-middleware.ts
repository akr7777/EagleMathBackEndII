import {NextFunction, Request, Response} from "express";
const ApiError = require('../exceptions/api-error');
const tokenService = require('../services/token-service');
const UserModel = require('../models/user-model');

module.exports = function (req: any, res:Response, next:NextFunction) {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return next(ApiError.UnauthorizedError());
        }

        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken) {
            return next(ApiError.UnauthorizedError());
        }

        const userData = tokenService.validateAccessToken(accessToken);
        if (!userData) {
            return next(ApiError.UnauthorizedError());
        }

        const user = UserModel.findOne({email: userData.email});
        if (!user) {
            return next(ApiError.UnauthorizedError());
        }
        //console.log("Auth-middleware / user.isActivated-=", user.isActivated)
        if (user.isActivated) {
            return next(ApiError.InactivatedUser());
        }

        req.user = userData;
        next();

    } catch (e){
        return next(ApiError.UnauthorizedError());
    }
}