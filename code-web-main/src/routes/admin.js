const express = require("express");
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post("/getmenu",adminController.getAllMenuData);
router.post("/getcate", adminController.getAllCateData);
router.post("/edit",adminController.edit);
router.post("/insert", adminController.insert);
router.post("/delete", adminController.delete);
router.post("/search", adminController.search)

module.exports = router;