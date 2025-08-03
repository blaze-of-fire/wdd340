const utilities = require(".");
    const { body, validationResult} = require("express-validator")
    const validate = {}

/*  **********************************
  *  New Inventory Data Validation Rules
  * ********************************* */
validate.newInvRules = () => {
    return [
        body("classification_id")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please select a classification."), 
        // firstname is required and must be string
        body("inv_make")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a make."), // on error this message is sent.

        // lastname is required and must be string
        body("inv_model")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a model."), // on error this message is sent.

        // firstname is required and must be string
        body("inv_year")
            .trim()
            .notEmpty()
            .isInt({ min: 1900, max: new Date().getFullYear() })
            .withMessage("Please provide a valid year."),
        
        body("inv_description")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a description."), 
        
        body("inv_image")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a image."), 
        
        body("inv_thumbnail")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a thumbnail."), 
        
        body("inv_price")
          .trim()
          .notEmpty()
          .isFloat({ min: 0 })
          .withMessage("Please provide a valid price."),
        
        body("inv_miles")
          .trim()
          .notEmpty()
          .isInt({ min: 0 })
          .withMessage("Please provide valid mileage."),
        
        body("inv_color")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 3 })
            .withMessage("Please provide a color."), 
    ]
}





/* ******************************
 * Check inv vehicle data and return errors or continue to management page
 * ***************************** */
validate.checkInvData = async (req, res, next) => {
    const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles,  inv_color } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-inventory", {
            title: "Add Inventory",
            nav,
            classificationList: await utilities.buildClassificationList(classification_id),
            errors: errors.array(),
            flashMessages: req.flash(),
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color
        })
        return
    }
    next()
}

/*  **********************************
  *  New Classification Data Validation Rules
  * ********************************* */
validate.newClassificationRules = () => {
    return [
        body("classification_name")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 3 })
            .withMessage("Please provide the new classification."),  
    ]
}

/* ******************************
 * Check inv classification data and return errors or continue to management page
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            title: "Add Classification",
            nav,
            errors: errors.array(),
            flashMessages: req.flash(),
            classification_name
        })
        return
    }
    next()
}

module.exports = validate