// Needed resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const accountValidate = require("../utilities/account-validation")

// Route to build the registration view
router.get("/register",
    utilities.handleErrors(accountController.buildRegister));

router.post("/register",
    accountValidate.registrationRules(),
    accountValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount))

// Route to build the login view
router.get("/login",
    utilities.handleErrors(accountController.buildLogin));

// Process login attempt
router.post(
    "/login",
    accountValidate.loginRules(),
    accountValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin))

router.get("/logout", utilities.handleErrors(accountController.logoutAccount))

// main and manage account route
router.get("/",
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildManagement))

// Route to the update account view
router.get("/update",
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildUpdateAccount)
)

// Route to update account information
router.post("/update",
    utilities.checkLogin,
    accountValidate.updateAccountRules(),
    accountValidate.checkAccountData,
    utilities.handleErrors(accountController.updateAccount)
)

// Route to change password
router.post("/password-change",
    utilities.checkLogin,
    accountValidate.passwordRules(),
    accountValidate.checkPasswordData,
    utilities.handleErrors(accountController.updatePassword)
)

module.exports = router;