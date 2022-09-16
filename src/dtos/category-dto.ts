module.exports = class CategoryDto {
    id: string;
    label: string;
    parentId: string;

    constructor(model: any) {
        this.id = model._id;
        this.label = model.label;
        this.parentId = model.parentId;
    }
}