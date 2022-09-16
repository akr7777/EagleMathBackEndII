//const {Schema, model} = require('mongoose');
//import {model, Schema} from "../server";
import {Schema, model} from 'mongoose';

const UserSchema = new Schema({
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    isActivated: {type: Boolean, default: false},
    activationLink: {type: String},
    isAdmin: {type: Boolean, default: false},
    name: {type: String},
});

module.exports = model('User', UserSchema);