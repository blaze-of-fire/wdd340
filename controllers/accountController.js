utilities = require("../utilities/index")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* *************************************
*  Deliver login view
* ************************************ */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null
    })
}

/* *************************************
*  Deliver registration view
* ************************************ */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Registration",
        nav,
        errors: null
    })
}

/* *************************************
*  Process Registration
* ************************************ */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body
    
    let hashedPassword;
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", "Sorry, there was an error processing the registration.")
        res.status(500).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    }

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )

    if (regResult) {
        req.flash("notice",
            `Congratulations you\'re registered ${account_firstname}. Please log in.`
        )
        res.status(201).redirect("/account/login")
    }
}

/* ***************************************
 *  Process login request
 * *********************************** */
async function accountLogin(req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
        })
        return
    }
    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_password
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600* 1000 })
            if (process.env.NODE_ENV === "development") {
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
            } else {
                res.cookie("jwt", accessToken, {httpOnly: true, maxAge: 3600 * 1000 })
            }
            return res.redirect("/account/")
        }
        else {
            req.flash("message notice", "Please check your credintials and try again.")
            res.status(400).render("account/login", {
                title: "Login",
                nav,
                errors: null,
                account_email,
            })
        }
    } catch (error) {
        throw new Error('Access Forbidden')
    }
}

/* ***************************************
 *  Logout of account
 * *********************************** */
function logoutAccount(req, res) {
    res.clearCookie("jwt")
    req.flash("notice", "You have been logged out.")
    res.redirect("/")
}

/* ***************************************
 *  build manage account view
 * *********************************** */
async function buildManagement(req, res) {
    let nav = await utilities.getNav()
    res.render("account/management", {
        title: "Account Management",
        nav,
        errors: null,
    })
}

/* **************************************
 * build update account view
 * ********************************** */
async function buildUpdateAccount(req, res) {
    let nav = await utilities.getNav()
    let account_id = res.locals.accountData.account_id
    const accountData = await accountModel.getAccountById(account_id)
    res.render("account/update-account", {
        title: "Update Account",
        nav,
        errors: null,
        account_firstname: accountData.account_firstname,
        account_lastname: accountData.account_lastname,
        account_email: accountData.account_email,
        account_id: accountData.account_id,
    })
}

/* **************************************
 * update the account information
 * ********************************** */
async function updateAccount(req, res) {
    let nav = await utilities.getNav()

    const { account_firstname, account_lastname, account_email, account_id } = req.body
    
    const updateResult = await accountModel.updateAccount(account_firstname, account_lastname, account_email, account_id)

    if (updateResult) {
        req.flash("notice", `The account was successfully updated.`)
        res.redirect('/account/')
    }   else {
            req.flash("notice", "Sorry, the update failed.")
            res.status(501).render("account/update-account", {
                title: "Update Account",
                nav,
                errors: null,
                account_firstname,
                account_lastname,
                account_email,
                account_id,
            })
        }
}

/* **************************************
 * update password information
 * ********************************** */
async function updatePassword(req, res) {
    let nav = await utilities.getNav()

    const { account_firstname, account_lastname, account_email, account_password, account_id } = req.body
    
    let hashedPassword;
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", "Sorry, there was an error processing the registration.")
        res.status(500).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    }

    const updateResult = await accountModel.updatePassword(hashedPassword, account_id)

    if (updateResult) {
        req.flash("notice", `The password was successfully updated.`)
        res.redirect('/account/')
    }   else {
            req.flash("notice", "Sorry, the update failed.")
            res.status(501).render("account/update-account", {
                title: "Update Account",
                nav,
                errors: null,
                account_firstname,
                account_lastname,
                account_email,
                account_id,
            })
        }
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, logoutAccount, buildManagement, buildUpdateAccount, updateAccount, updatePassword }