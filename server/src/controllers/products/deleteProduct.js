const productsSchema = require("../../models/products.js");
const { deleteImage } = require("../../utils/cloudinary.js");

const deleteProduct = async (req, res) => {
    try {
        const product = await productsSchema.findOne({ _id: req.params.id });
        if (product) {
            for (let i = 0; i < product.images.length; i++) {
                await deleteImage(product.images[i].public_id);
            }
            await productsSchema.findByIdAndDelete(req.params.id);
            res.status(200).json(product);
        } else {
            res.status(404).json({ error: "product not found" });
        }
    } catch (error) {
        res.status(400).json({ error: error });
    }
};


module.exports = deleteProduct;