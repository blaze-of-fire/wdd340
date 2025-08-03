// Needed resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const inventoryValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build a vehicle's detail page by inventory view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId));

// Route to build management view
router.get("/", utilities.handleErrors(invController.buildManagementView))

// Route to display the add classification form
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))

// Route to handle add to classification form submission
router.post("/add-classification", 
    inventoryValidate.newClassificationRules(),
    inventoryValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification))


// Route to display the add inventory form
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))

// Route to handle add to inventory form submission
router.post("/add-inventory",
    inventoryValidate.newInvRules(),
    inventoryValidate.checkInvData,
    utilities.handleErrors(invController.addInventory))

module.exports = router;