// Needed resources
const express = require("express")
const router = new express.Router()
const errorController = require("../controllers/errorController")
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get("/theerror/:classificationId", utilities.handleErrors(errorController.buildByClassificationId));

module.exports = router;