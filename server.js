/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const inventoryRoute = require("./routes/inventoryRoute")
const errorRoute = require("./routes/errorRoute")
const baseController = require("./controllers/baseController")
const utilities = require("./utilities/index")

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "layouts/layout")

/* ***********************
 * Routes
 *************************/
app.use(utilities.handleErrors(static))

// Index Route
app.get("/", utilities.handleErrors(baseController.buildHome))

// Inventory Routes
app.use("/inv", utilities.handleErrors(inventoryRoute))

// Route Leading to 500 Error
app.use("/error", utilities.handleErrors(errorRoute))

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: "Sorry, we appear to have lost that page."})
})

/* ***********************
 * Express Error Handler
 * Place after all other middleware
 ************************/
app.use(async (err, req, res, next) => {
    let nav = await utilities.getNav()
    let message
    console.error(`Error at: "${req.originalUrl}": ${err.message}`)
    if(err.status == 404){message = err.message} else {message = "Oh no! You crashed. Try the nav bar to get back on track."}
    res.render("errors/error", {
        title: err.status || "Server Error",
        message,
        nav
    })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
