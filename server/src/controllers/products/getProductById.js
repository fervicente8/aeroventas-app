const productsSchema = require("../../models/products.js");

const getProductById = async (req, res) => {
    try {
        const product = await productsSchema.findOne({ _id: req.params.id });
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ error: error });
    }
};


module.exports = getProductById;