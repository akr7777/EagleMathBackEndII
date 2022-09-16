module.exports = class UserDto {
    email: string;
    id: string;
    isActivated: boolean;
    activationLink: string;
    isAdmin: boolean;
    name: string;

    constructor(model: any) {
        this.email = model.email;
        this.id = model._id;
        this.isActivated = model.isActivated;
        this.activationLink = model.activationLink;
        this.isAdmin = model.isAdmin;
        this.name = model.name;
    }
}