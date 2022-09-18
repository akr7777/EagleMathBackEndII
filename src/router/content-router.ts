//const Router = require('express').Router;
import {Router} from "express";
const contentController = require("../controllers/content-controller");
const dcController = require("../controllers/desription-contact-controller");

//const router = new Router();
const router = Router();

router.get('/getAllCategories', contentController.getAllCategories);
router.get('/getAllMaterials', contentController.getAllMaterials);
router.get('/getAllTasks', contentController.getAllTasks);

router.post('/getFavorites', contentController.getFavoritesContent);
router.post('/addContentToFavorites', contentController.addContentToFavorites);
router.post('/deleteContentFromFavorites', contentController.deleteContentFromFavorites);


router.get('/getDescription', dcController.getDescription);
router.get('/getDescriptionPhoto', dcController.getDescriptionPhoto);
router.get('/getContacts', dcController.getContacts);

module.exports = router;