const buyplanesSchema = require("../../models/buy-planes.js");
const { deleteImage } = require("../../utils/cloudinary.js");

const deletePlane = async (req, res) => {
    try {
        const product = await buyplanesSchema.findOne({ _id: req.params.id });
        if (product) {
            for (let i = 0; i < product.images.length; i++) {
                await deleteImage(product.images[i].public_id);
            }
            await buyplanesSchema.findByIdAndDelete(req.params.id);
            res.status(200).json(product);
        } else {
            res.status(404).json({ error: "product not found" });
        }
    } catch (error) {
        res.status(400).json({ error: error });
    }
};


module.exports = deletePlane;