import {Schema, model} from 'mongoose';

/*export type FavoriteContentModelType = {
    userId: string,
    favorites: string[],
}*/
const favoriteSchema = new Schema({
    userId: {type: String, required: true},
    favorites: {type: Array, required: true, default: []}
});

module.exports = model('favorite', favoriteSchema);