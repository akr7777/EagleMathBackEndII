import fs from "fs";
const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const favoriteModel = require('../models/favorite-content-model');
//const mailService = require('../services/mail-service');
const sendActivationEmail = require('../services/mail-service-2');
const tokenService = require('../services/token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');
const resultCodes = require('../utils/resultCodes');

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

        // Отправляем письмо активации
        console.log('SENDING ACTIVATION EMAIL...')
        //await sendActivationEmail(email, process.env.API_URL+'/auth/activate/'+activationLink);
        console.log('email=', email, 'activationLink=', process.env.API_URL+'/auth/activate/'+activationLink);

        //создаем токен для новго пользователя
        const userDto = new UserDto(user); //id, email, isActivated, activationLink, isAdmin, name
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        //добавляем в таблицу favorites пустой array, чтобы функция была доступна для нового пользователя
        await favoriteModel.create({
            userId: userDto.id,
            favorites: []
        });

        return { ...tokens, user: userDto, resultCode: resultCodes.Success, message: "Пользователь успешно зарегистрирован"}
    }

    async activate(activationLink: string) {
        //console.log('ACTIVATION USER ACCOUNT STARTING...')
        const user = await UserModel.findOne({activationLink: activationLink});
        if (!user) {
            //throw ApiError.BadRequest('Некорректная ссылка активации')
            return {resultCode: resultCodes.wrongActivationLink, message: 'Ссылка автивации неверная.'}
        }
        user.isActivated = true;
        await user.save();
        //console.log('ACTIVATION USER ACCOUNT FINISHED')
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
        //console.log('USER SERVICE , refreshToken=', refreshToken)
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

    async getAvatarFile(id: string) {
        const folderPath = process.env.INIT_CWD + '' + process.env.PATH_TO_UPLOADS;
        const fileName = 'avatar_' + id + '.';
        let avaFile =  folderPath + 'abstractAvatar.jpeg';

        if (process.env.IMAGE_EXTS) {
            process.env.IMAGE_EXTS.split('/').forEach(ext => {
                if (fs.existsSync(folderPath + fileName + ext))
                    avaFile = folderPath + fileName + ext;
            })
        }
        return avaFile;
    }

    async saveNewAvatar(file: any, userId: string) {
        const oldAvaPhoto = process.env.INIT_CWD + '' + process.env.PATH_TO_UPLOADS + 'avatar_' + userId;
        if (process.env.IMAGE_EXTS) {
            process.env.IMAGE_EXTS.split('/').forEach(ext => {
                if (fs.existsSync(oldAvaPhoto + '.' + ext)) {
                    fs.unlink(oldAvaPhoto + '.' + ext, err => {
                        if (err) throw err; // не удалось удалить файл
                        console.log('Файл успешно удалён');
                    })
                }
            })
        }
        //Записываем на место старого фото новое фото с новым расширением
        try {
            const arr = file.name.split('.');
            const fileExtension = arr[arr.length-1];
            await file.mv(process.env.INIT_CWD + '' + process.env.PATH_TO_UPLOADS + 'avatar_' + userId + '.'+ fileExtension);
        } catch (e) {
            console.log('FILE!!! e= ',e)
        }
    }

    async updatePassword(id: string, newPass: string, oldPass: string) {
        try {
            const user = await UserModel.findById({_id : id});
            if (!user)
                return { resultCode: resultCodes.Error };
            const isEqual = await bcrypt.compare(oldPass, user.password);
            if (!isEqual) {
                //throw ApiError.BadRequest('Неверный пароль')
                return { resultCode: resultCodes.oldUserPassIsIncorrect };
            }
            const newHashPassword = await bcrypt.hash(newPass, 3);

            user.password = newHashPassword;
            await user.save();

            return { resultCode: resultCodes.Success};
        }
        catch (e) {
            console.log('User service / updatePassword/ Erorr: ', e)
        }

    }

    async getAllUsers() {
        const users:Array<any> = await UserModel.find();
        return users.map( el => {
            return {
                userId: el._id,
                name: el.name,
                email: el.email,
                isAdmin: el.isAdmin,
            }
        });
    }

    async getOneUser(userId: string) {
        const user = await UserModel.findById({_id : userId});
        if (user) {
            return {
                user: {
                    userId: userId,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin,
                },
                resultCode: resultCodes.Success
            }
        }
        return { resultCode: resultCodes.Error}
    }

    async deleteUser(userId: string) {
        await UserModel.deleteOne({_id: userId}, (err: any, result: any) => {
            console.log('userServeice / deleteUser / err=', err, 'result=', result)
        });
        const users = await this.getAllUsers();
        return users;
    }

    async makeUserAdmin(userId: string) {
        const user = await UserModel.findById(userId);
        if (user) {
            user.isAdmin = true;
            await user.save();
        }
        const users = await this.getAllUsers();
        return {users: users, currentUserID: userId, resultCode: resultCodes.Success};
    }

    async makeUserAsUser(userId: string) {
        const userNewAdmin = await UserModel.findOne({_id: userId});
        if (userNewAdmin) {
            userNewAdmin.isAdmin = false;
            await userNewAdmin.save();
        }
        const users = await this.getAllUsers();
        return {users: users, currentUserID: userId, resultCode: resultCodes.Success};
    }
}

module.exports = new UserService();