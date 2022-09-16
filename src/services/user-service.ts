//import {client} from "../server";

import fs from "fs";

const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
//const mailService = require('../services/mail-service');
const sendActivationEmail = require('../services/mail-service-2');
const tokenService = require('../services/token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');
const resultCodes = require('../utils/resultCodes');
//import { Request, Response, NextFunction } from 'express';

class UserService {
    async registration(name: string, email: string, password: string) {

        const candidate = await UserModel.findOne({email});
        if (candidate) {
            //throw ApiError.BadRequest(`Пользователь с почтовый адресом ${email} уже существует`);
            return {resultCode: resultCodes.userAlreadyExists, message: 'Пользователь с почтой '+email+' уже существует.'}
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();

        const user = await UserModel.create({
            email: email,
            password: hashPassword,
            activationLink: activationLink,
            name: name,
        });

        console.log('SENDING ACTIVATION EMAIL...')
        //await sendActivationEmail(email, process.env.API_URL+'/auth/activate/'+activationLink);
        console.log('email=', email, 'activationLink=', process.env.API_URL+'/auth/activate/'+activationLink);

        console.log('registration / TOKEN GENERATION')
        const userDto = new UserDto(user); //id, email, isActivated, activationLink, isAdmin, name
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        console.log('registration / TOKEN GENERATED AND SAVED')

        return { ...tokens, user: userDto, resultCode: resultCodes.Success, message: "Пользователь успешно зарегистрирован"}
    }

    async activate(activationLink: string) {
        console.log('ACTIVATION USER ACCOUNT STARTING...')
        const user = await UserModel.findOne({activationLink: activationLink});
        if (!user) {
            //throw ApiError.BadRequest('Некорректная ссылка активации')
            return {resultCode: resultCodes.wrongActivationLink, message: 'Ссылка автивации неверная.'}
        }
        user.isActivated = true;
        await user.save();
        console.log('ACTIVATION USER ACCOUNT FINISHED')
    }

    async login (email: string, password: string) {
        const user = await UserModel.findOne({email});
        if (!user) {
            //throw ApiError.BadRequest('Пользователь с почтой '+email+' не найден.');
            return {resultCode: resultCodes.userDoesNotExistsCode, message: 'Пользователь с почтой '+email+' не найден.'}
        }
        if (!user.isActivated) {
            //throw ApiError.BadRequest('пользователь с почтой '+email+' не активирован')
            return {
                resultCode: resultCodes.userIsNotActivated,
                message: 'Пользователь с почтой '+email+' не активирован. Ссылка для активации: '+process.env.API_URL+'/auth/activate/'+user.activationLink,
                activationLink: user.activationLink,
            }
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            //throw ApiError.BadRequest('Неверный пароль')
            return {resultCode: resultCodes.wrongPassword, message: 'Неверный пароль'}
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return { ...tokens, userInfo: userDto, resultCode: resultCodes.Success }
    }

    async logout(refreshToken:string) {
        try {
            const token = await tokenService.removeToken(refreshToken);
            return {token, resultCode: resultCodes.Success};
        }
        catch (e) {
            console.log('Logout Error: ', e)
        }

    }

    async refresh(refreshToken:string) {
        console.log('USER SERVICE , refreshToken=', refreshToken)
        if (!refreshToken) {
            //ApiError.UnauthorizedError();
            return {resultCode: resultCodes.userUnautorized, message: 'Пользователь не авторизирован.'}
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            //throw ApiError.UnauthorizedError();
            return {resultCode: resultCodes.userUnautorized, message: 'Пользователь не авторизирован.'}
        }

        const user = await UserModel.findById(userData.id);

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return { ...tokens, user: userDto, resultCode: resultCodes.Success}
    }

    async getAllUsers() {
        console.log("getAllUsers")
        const users = await UserModel.find();
        return users;
    }

    async getAvatarFile(id: string) {
        const folderPath = process.env.INIT_CWD + '' + process.env.STANDART_USER_AVATAR;
        const fileName = 'avatar_' + id + '.';
        let avaFile =  folderPath + 'abstractAvatar.jpeg';

        //const fs = require('fs');
        //console.log('TYPES=', process.env.IMAGE_EXTS, typeof process.env.IMAGE_EXTS);
        if (process.env.IMAGE_EXTS) {
            process.env.IMAGE_EXTS.split('/').forEach(ext => {
                //console.log('PATH!=', folderPath+fileName+ext, fs.existsSync(folderPath+fileName+ext))
                if (fs.existsSync(folderPath + fileName + ext))
                    avaFile = folderPath + fileName + ext;
            })
        }
        return avaFile;
    }
}

module.exports = new UserService();