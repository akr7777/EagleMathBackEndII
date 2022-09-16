//const Router = require('express').Router;
import {Router} from "express";
const contentController = require("../controllers/content-controller");

//const router = new Router();
const router = Router();

router.get('/getAllCategories', contentController.getAllCategories);
router.get('/getAllMaterials', contentController.getAllMaterials);
router.get('/getAllTasks', contentController.getAllTasks);

router.post('/getFavorites', contentController.getFavoritesContent);
router.post('/addContentToFavorites', contentController.addContentToFavorites);
router.post('/deleteContentFromFavorites', contentController.deleteContentFromFavorites);

module.exports = router;