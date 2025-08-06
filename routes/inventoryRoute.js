// Needed resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const inventoryValidate = require("../utilities/inventory-validation")
const accountValidate = require("../utilities/account-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build a vehicle's detail page by inventory view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId));

// Route to build management view
router.get("/",
    utilities.checkLogin,
    accountValidate.checkAuthorizationNotClient,
    utilities.handleErrors(invController.buildManagement))

// Route to display the add classification form
router.get("/add-classification",
    utilities.checkLogin,
    accountValidate.checkAuthorizationNotClient,
    utilities.handleErrors(invController.buildAddClassification))

// Route to handle add to classification form submission
router.post("/add-classification",
    utilities.checkLogin,
    accountValidate.checkAuthorizationNotClient,
    inventoryValidate.newClassificationRules(),
    inventoryValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification))


// Route to display the add inventory form
router.get("/add-inventory",
    utilities.checkLogin,
    accountValidate.checkAuthorizationNotClient,
    utilities.handleErrors(invController.buildAddInventory))

// Route to handle add to inventory form submission
router.post("/add-inventory",
    utilities.checkLogin,
    accountValidate.checkAuthorizationNotClient,
    inventoryValidate.newInvRules(),
    inventoryValidate.checkInvData,
    utilities.handleErrors(invController.addInventory))

// For the select on the vehicle management page that updates the table everytime a new classification is selected
router.get("/getInventory/:classification_id",
    utilities.checkLogin,
    accountValidate.checkAuthorizationNotClient,
    utilities.handleErrors(invController.getInventoryJSON))

// Route to the edit page from the vehicle management page
router.get("/edit/:invId",
    utilities.checkLogin,
    accountValidate.checkAuthorizationNotClient,
    utilities.handleErrors(invController.buildEditItemInfo));

// Route to handle the form submission for edit vehicle page
router.post("/update/",
    utilities.checkLogin,
    accountValidate.checkAuthorizationNotClient,
    inventoryValidate.newInvRules(),
    inventoryValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory))

// Route to the delete confirmation page from the vehicle management page
router.get("/delete/:invId",
    utilities.checkLogin,
    accountValidate.checkAuthorizationNotClient,
    utilities.handleErrors(invController.buildDeleteItemInfo));

// Route to handle the form submission for the delete vehicle confirmation page
router.post("/delete/",
    utilities.checkLogin,
    accountValidate.checkAuthorizationNotClient,
    utilities.handleErrors(invController.deleteInventoryItem))

module.exports = router;