const express = require("express");
const router = express.Router();
const homeController = require('../controllers/homeController');

router.post("/all",homeController.getAllMenuData);


module.exports = router;