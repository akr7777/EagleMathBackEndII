const categoryModel = require('../models/categories-model');
const CategoryDto = require('../dtos/category-dto');

class ContentService {
    async getAllCategories() {
        //const categories = categoryModel.find();
        //const categoriesDto = new CategoryDto(categories);
        return categoryModel.find();
    }
}

module.exports = new ContentService();