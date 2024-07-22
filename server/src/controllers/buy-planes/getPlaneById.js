const buyplanesSchema = require("../../models/buy-planes.js");

const getPlaneById = async (req, res) => {
    try {
        const product = await buyplanesSchema.findOne({ _id: req.params.id });
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ error: error });
    }
};


module.exports = getPlaneById;