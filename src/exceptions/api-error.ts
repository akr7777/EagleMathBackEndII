module.exports = class ApiError extends Error {
    status:number;
    errors:Array<any>;

    constructor(status:number, message:string, errors=[]) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static UnauthorizedError() {
        return new ApiError(401, 'Пользователь не авторизирован');
    }

    static InactivatedUser() {
        return new ApiError(401, 'Пользователь не активирован');
    }

    static BadRequest(message: string, errors=[]) {
        return new ApiError(400, message, errors)
    }
}