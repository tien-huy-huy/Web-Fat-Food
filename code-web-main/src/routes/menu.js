const express = require("express");
const router = express.Router();
const menuController = require('../controllers/menuController');

router.post("/all",menuController.getAllMenuData);


module.exports = router;