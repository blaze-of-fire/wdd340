const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 * Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}

/* ***************************
 * Build vehicle page by classification view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
    const inv_id = req.params.invId
    const data = await invModel.getViewByInvId(inv_id)  
    const view = await utilities.buildItemDetailView(data)
    let nav = await utilities.getNav()
    item = data[0]
    const theTitle = item.inv_year + ' ' + item.inv_make + ' ' + item.inv_model
    res.render("./inventory/vehicle", {
        title: theTitle,
        nav,
        view,
    })
}

module.exports = invCont