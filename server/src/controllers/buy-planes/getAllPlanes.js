const buyplanesSchema = require("../../models/buy-planes.js");

const getAllPlanes = async (req, res) => {
    try {
        const products = await buyplanesSchema.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({ error: error });
    }
};

module.exports = getAllPlanes;
