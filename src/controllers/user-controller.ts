import { Request, Response, NextFunction } from 'express';
const userService = require('../services/user-service');
const {validationResult} = require('express-validator');
const ApiError = require('../exceptions/api-error');
const resultCodes = require("../utils/resultCodes");

class UserController {
    async registration(req:Request, res:Response, next:NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
            }
            const {name, email, password} = req.body;

            const userData = await userService.registration(name, email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});

            res.json(userData);
        } catch (e) {
            console.log('UserController / registration =', e)
            next(e);
        }
    }

    async login(req:Request, res:Response, next:NextFunction) {
        console.log('LOGINING...')
        try {
            const {email, password} = req.body;
            const userData = await userService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});

            res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async logout(req:Request, res:Response, next:NextFunction) {
        console.log('LOGOUT...')
        try {
            const {refreshToken} = req.cookies;
            console.log('logout refreshToken=', refreshToken)
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            console.log('logout, token', token)
            return res.json(token);
        } catch (e) {
            next(e);
        }
    }

    async activate(req:Request, res:Response, next:NextFunction) {
        try {
            const activationLink = req.params.link;
            await userService.activate(activationLink);
            return res.redirect(process.env.API_CLIENT_URL || 'https://www.google.com');
        } catch (e) {
            next(e);
        }
    }

    async refresh(req:Request, res:Response, next:NextFunction) {
        console.log('REFRESHING TOKEN')
        try {
            const {refreshToken} = req.cookies;
            console.log('refreshToken = ',refreshToken)
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async getUsers(req:Request, res:Response, next:NextFunction) {
        console.log('UserController  / getUsers')
        try {
            const users = await userService.getAllUsers();
            res.json(users);
        } catch (e) {
            next(e);
        }
    }

    async getAvatar(req:Request, res:Response, next:NextFunction) {
        console.log('UserController / getAvatar')
        try {
            const {id} = req.query;
            const avatarFile = await userService.getAvatarFile(id);

            res.statusCode = 200;
            res.setHeader("Content-Type", "image/jpeg");
            require("fs").readFile(avatarFile, (err:any, image:any) => {
                res.end(image);
            });
        }
         catch (e) {
             next(e);
        }
    }

    async updatePassword(req:Request, res:Response, next:NextFunction) {
        try {
            const {id, newPass, oldPass} = req.body;
            const resultCode = await userService.updatePassword(id, newPass, oldPass);
            res.json(resultCode);
        } catch (e) {
            next(e)
        }
    }

    async uploadAvatar(req:Request, res:Response, next:NextFunction) {
        try {
            const { id } = req.body;
            //req.files.file;
            let file;
            if (req.files && req.files.file)
                file = req.files.file;
            if (file) {
                await userService.saveNewAvatar(file, id);
                res.json({resultCode: resultCodes.Success});
            } else {
                res.json({resultCode: resultCodes.Error});
            }
        } catch (e) {
            next(e)
        }
    }

}

module.exports = new UserController();