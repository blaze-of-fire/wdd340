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
        errors: null,
        flashMessages: req.flash()
    })
}

/* **************************
 *  Insert Inventory Item
 * ************************* */
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
invCont.buildManagement = async function (req, res) {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()
    res.render("inventory/management", {
        title: "Vehicle Management",
        nav,
        classificationSelect,
    })
}

/* **************************
 *  Return Inventory by Classification As JSON
 * ************************* */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
        return res.json(invData)
    } else {
        next(new Error("No data returned"))
    }
}

/* *****************************
 * Build edit inventory view
 * **************************** */
invCont.buildEditItemInfo = async function (req, res, next) {
    const inv_id = parseInt(req.params.invId)
    let nav = await utilities.getNav()
    const itemDataArray = await invModel.getViewByInvId(inv_id);
    const itemData = itemDataArray[0]; 
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
    const classificationList = await utilities.buildClassificationList(itemData.classification_id)
    res.render("./inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationList: classificationList,
        errors: null,
        flashMessages: req.flash(),
        inv_id: itemData.inv_id,
        inv_make: itemData.inv_make,
        inv_model: itemData.inv_model,
        inv_year: itemData.inv_year,
        inv_description: itemData.inv_description,
        inv_image: itemData.inv_image,
        inv_thumbnail: itemData.inv_thumbnail,
        inv_price: itemData.inv_price,
        inv_miles: itemData.inv_miles,
        inv_color: itemData.inv_color,
        classification_id: itemData.classification_id,
    })
}

/* **************************
 *  Update Inventory Data
 * ************************* */
invCont.updateInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    const {
        classification_id, inv_make, inv_model, inv_year, inv_description,
        inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, inv_id,
    } = req.body

    const updateResult = await invModel.updateInventory(
        classification_id, inv_make, inv_model, inv_year, inv_description,
        inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, inv_id,
    )

    if (updateResult) {
        const itemName = updateResult.inv_make + " " + updateResult.inv_model
        req.flash("notice", `The ${itemName} was successfully updated.`)
        res.redirect('/inv/')
    } else {
        const classificationList = await utilities.buildClassificationList(classification_id)
        const itemName = `${inv_make} ${inv_model}`
        req.flash("notice", "Sorry, the insert failed.")
        res.status(501).render("inventory/edit-inventory", {
            title: "Edit " + itemName,
            nav,
            classificationList: classificationList,
            errors: null,
            classification_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            inv_id,
        })
    }
}

/* *****************************
 * Build delete vehicle confirmation view
 * **************************** */
invCont.buildDeleteItemInfo = async function (req, res, next) {
    const inv_id = parseInt(req.params.invId)
    let nav = await utilities.getNav()
    const itemDataArray = await invModel.getViewByInvId(inv_id);
    const itemData = itemDataArray[0]; 
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
    res.render("inventory/delete-confirm", {
        title: "Delete " + itemName,
        nav,
        errors: null,
        flashMessages: req.flash(),
        inv_id: itemData.inv_id,
        inv_make: itemData.inv_make,
        inv_model: itemData.inv_model,
        inv_year: itemData.inv_year,
        inv_price: itemData.inv_price,
    })
}

/* **************************
 *  Delete Inventory Item Data
 * ************************* */
invCont.deleteInventoryItem = async function (req, res, next) {
    let nav = await utilities.getNav()
    const { inv_id, inv_make, inv_model, inv_year, inv_price } = req.body

    const deleteResult = await invModel.deleteInventoryItem(parseInt(inv_id))

    if (deleteResult) {
        const itemName = inv_make + " " + inv_model
        req.flash("notice", `The ${itemName} was successfully deleted.`)
        res.redirect('/inv/')
    } else {
        const itemName = `${inv_make} ${inv_model}`
        req.flash("notice", "Sorry, the delete failed.")
        res.status(501).render("inventory/delete-confirm", {
            title: "Delete " + itemName,
            nav,
            errors: null,
            inv_make,
            inv_model,
            inv_year,
            inv_price,
            inv_id,
        })
    }
}


module.exports = invCont