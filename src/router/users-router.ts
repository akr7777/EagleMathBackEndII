
//router.get('/users', /*authMiddleware,*/ userController.getUsers);

//const Router = require('express').Router;
import {Router} from "express";
const userController = require('../controllers/user-controller');

const router = Router();
const {body} = require('express-validator');
//const authMiddleware = require('../middleware/auth-middleware');

router.get('/getUsers', /*authMiddleware,*/ userController.getUsers);
router.post('/getOneUser', /*authMiddleware,*/ userController.getOneUser);


module.exports = router;