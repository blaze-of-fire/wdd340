const pool = require("../database/")

/* **************************
 * Get all classification data
 * ************************* */
async function getClassifications(){
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 * Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i
            JOIN public.classification AS c
            ON i.classification_id = c.classification_id
            WHERE i.classification_id = $1`,
            [classification_id]
        )
        return data.rows
    } catch (error) {
        console.error("getclassificationbyid error " + error)
    }
}

/* ***************************
 * Get the inventory item details by inv_id
 * ************************** */
async function getViewByInvId(inv_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i
            WHERE i.inv_id = $1`,
            [inv_id]
        )
        return data.rows
    } catch (error) {
        console.error("getviewbyinvid error " + error)
    }
}

/* ***************************
 * Insert a new classification
 * ************************** */
async function insertClassification(classification_name) {
    try {
        const sql = "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *"
            return await pool.query(sql, [classification_name])
    } catch (error) {
        throw error
    }
}

/* ***************************
 * Insert a new inventory item
 * ************************** */
async function insertInventory(classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color) {
    try {
        const sql = "INSERT INTO public.inventory (classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
        const result = await pool.query(sql, [classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color])
        return result.rows[0]
    } catch (error) {
        throw error
    }
}

/* ***************************
 * Update a inventory item
 * ************************** */
async function updateInventory(classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, inv_id) {
    try {
        const sql = "UPDATE public.inventory SET classification_id = $1, inv_make = $2, inv_model = $3, inv_year = $4, inv_description = $5, inv_image = $6, inv_thumbnail = $7, inv_price = $8, inv_miles = $9, inv_color = $10 WHERE inv_id = $11 RETURNING *"
        const data = await pool.query(sql, [classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, inv_id])
        return data.rows[0]
    } catch (error) {
        console.error("model error: " + error)
    }
}

/* ***************************
 * Delete a inventory item
 * ************************** */
async function deleteInventoryItem(inv_id) {
    try {
        const sql = "DELETE FROM public.inventory WHERE inv_id = $1"
        const data = await pool.query(sql, [inv_id])
        return data
    } catch (error) {
        new Error("Delete Inventory Error")
    }
}

module.exports = { getClassifications, getInventoryByClassificationId, getViewByInvId, insertClassification, insertInventory, updateInventory, deleteInventoryItem };