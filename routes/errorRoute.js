// Needed resources
const express = require("express")
const router = new express.Router()
const errorController = require("../controllers/errorController")

// Route to build inventory by classification view
router.get("/theerror/:classificationId", errorController.buildByClassificationId);

module.exports = router;