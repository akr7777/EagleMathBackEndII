enum ResultCodesEnum {
    //Успешная операция
    Success = 0,

    //Пользователь не существует
    userDoesNotExistsCode= 11,

    //пользователь не активирован
    userIsNotActivated = 12,

    //пользователь ввел неверный пароль при логине
    wrongPassword = 13,

    //пользователь не авторизирован для просмотра материала
    userUnautorized = 14,

    //неверная ссылка автивации
    wrongActivationLink = 15,

    //пользователь уже существует
    userAlreadyExists = 16,

    //Старый пароль введен неверно при попытке смены пароля
    oldUserPassIsIncorrect = 17,

    Error = 1,
}

module.exports = ResultCodesEnum;