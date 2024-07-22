const productsSchema = require("../../models/products.js");

const getAllProducts = async (req, res) => {
    try {
        const products = await productsSchema.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({ error: error });
    }
};

module.exports = getAllProducts;
