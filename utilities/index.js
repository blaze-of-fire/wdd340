const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req,res, next) {
    let data = await invModel.getClassifications()
    console.log(data)
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
        '<a href="/inv/type/' +
        row.classification_id +
        '" title="See our inventory of ' +
        row.classification_name +
        ' vehicles">' +
        row.classification_name +
        "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}

/* **************************************
 * Build the classification view HTML
 * *********************************** */
Util.buildClassificationGrid = async function(data){
    let grid
    if (data.length > 0){
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => {
            grid += '<li>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id
            + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
            + ' details"><img src="' + vehicle.inv_thumbnail
            + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model 
            + ' on CSE Motors"></a>'
            grid += '<div class="namePrice">'
            grid += '<hr />'
            grid += '<h2>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
            + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
            + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '<span>$'
            + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '</li>'
        })
        grid += '</ul>'
    } else {
        grid += '<p class="notice">Sorry, no matching vehicles could be found.' + '</p>'
    }
    return grid
}

/* **************************************
 * Build the vehicle view HTML
 * *********************************** */
Util.buildItemDetailView = async function(data){
    let view = ""
    let vehicle = data[0]
    if (data.length > 0){
        view = '<div class="vehicleDisplay">'
        view += '<img src="' + vehicle.inv_image
        + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
        + ' on CSE Motors" >'
        view += '<span class="price">Price: $'
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        view += '<div class="vehicleInfo">'
        view += '<h2>' + vehicle.inv_make + ' ' 
        + vehicle.inv_model + ' Details' + '</h2>'
        view += '<p>' + '<span>Description: </span>' + vehicle.inv_description + '</p>'
        view += '<p>' + '<span>Color: </span>' + vehicle.inv_color + '</p>'
        view += '<p>' + '<span>Miles: </span>' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + '</p>'
        view += '</div>'
        view += '</div>'
    } else {
        view += '<p class="notice">Sorry, this vehicle could not be found.' + '</p>'
    }
    return view
}

/* *****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 ***************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util