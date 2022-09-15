//import {client} from "../server";

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
    async registration(email: string, password: string) {
        console.log('UserService / registration / starting....')
        /*await client.connect((err:any) => {
            const collection = client.db("eagle111").collection("users");
            // perform actions on the collection object
            //console.log('collection=', collection)

            const silence = new UserModel({ email: email, password: password });
            console.log('SILENCE: ',silence.email, silence.password); // 'Silence'
            silence.save();

            client.close();
        });*/

        console.log('UserService / registration / finding candidate....')
        const candidate = await UserModel.findOne({email});
        if (candidate) {
            //throw ApiError.BadRequest(`Пользователь с почтовый адресом ${email} уже существует`);
            return {resultCode: resultCodes.userAlreadyExists, message: 'Пользователь с почтой '+email+' уже существует.'}
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();

        console.log('UserService / registration / creating user with params: email='+email+', password='+password+' + activationLink='+activationLink, '....')
        const user = await UserModel.create({email: email, password: hashPassword, activationLink: activationLink});

        console.log('SENDING ACTIVATION EMAIL...')
        //await sendActivationEmail(email, process.env.API_URL+'/auth/activate/'+activationLink);
        console.log('email=', email, 'activationLink=', process.env.API_URL+'/auth/activate/'+activationLink);

        console.log('registration / TOKEN GENERATION')
        const userDto = new UserDto(user); //id, email, isActivated
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        console.log('registration / TOKEN GENERATED AND SAVED')

        return { ...tokens, user: userDto }
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
                message: 'Пользователь с почтой '+email+' не активирован. Ссылка для активации: '+user.activationLink,
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
        return { ...tokens, user: userDto }
    }

    async getAllUsers() {
        console.log("getAllUsers")
        const users = await UserModel.find();
        return users;
    }
}

module.exports = new UserService();