//const Router = require('express').Router;
import {Router} from "express";
const contentController = require("../controllers/content-controller");
const dcController = require("../controllers/desription-contact-controller");

//const router = new Router();
const router = Router();

router.get('/getAllCategories', contentController.getAllCategories);
router.get('/getAllMaterials', contentController.getAllMaterials);
router.get('/getAllTasks', contentController.getAllTasks);

router.get('/getContent/:contentId', contentController.getContent);
router.post('/setContent', contentController.setContent);
router.post('/setContentImage', contentController.setContentImage)
router.get('/getContentImage', contentController.getContentImage)

router.post('/getFavorites', contentController.getFavoritesContent);
router.post('/addContentToFavorites', contentController.addContentToFavorites);
router.post('/deleteContentFromFavorites', contentController.deleteContentFromFavorites);

router.get('/getDescription', dcController.getDescription);
router.post('/setDescription', dcController.setDescription);
router.get('/getDescriptionPhoto', dcController.getDescriptionPhoto);
router.post('/setDescriptionPhoto', dcController.setDescriptionPhoto);
router.get('/getContacts', dcController.getContacts);
router.post('/setContacts', dcController.setContacts);

router.post('/renameContent', contentController.renameContent);
router.post('/changeParentId', contentController.changeParentId);

module.exports = router;