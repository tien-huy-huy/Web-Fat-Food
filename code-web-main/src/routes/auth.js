const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const menuController = require('../controllers/menuController');
const homeController = require('../controllers/homeController');
const adminController = require('../controllers/adminController');


// POST /api/auth/login
router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/all",menuController.getAllMenuData);
router.post("/all",homeController.getAllMenuData);
router.post("/all",adminController.getAllMenuData);

module.exports = router;
