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

/* ***************************
 * Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: [],
    flashMessages: req.flash()
  })
}

invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body

  const result = await invModel.insertClassification(classification_name)

  if (!result) {
    const error = new Error("Failed to add classification.")
    error.status = 500
    return next(error)
  }

  req.flash("notice", "Classification added successfully!")
  res.redirect('/inv')
}

/* ***************************
 * Build add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  console.log(classificationList)
  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    errors: [],
    flashMessages: req.flash()
  })
}

invCont.addInventory = async function (req, res, next) {
  const {
    classification_id, inv_make, inv_model, inv_year, inv_description,
    inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
  } = req.body

  const result = await invModel.insertInventory(
    classification_id, inv_make, inv_model, inv_year, inv_description,
    inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
  )

  if (!result) {
    const error = new Error("Failed to add inventory item.")
    error.status = 500
    return next(error)
  }

  req.flash("notice", "Inventory item added successfully!")
  res.redirect('/inv')
}

/* ***************************
 * Build management view
 * ************************** */
invCont.buildManagementView = async function (req, res) {
    let nav = await utilities.getNav()
    res.render("inventory/management", {
        title: "Vehicle Management",
        nav,
    })
}

module.exports = invCont