const buyplanesSchema = require("../../models/buy-planes.js");
const { deleteImage } = require("../../utils/cloudinary.js");

const deletePlaneById = async (req, res) => {
    try {
        const plane = await buyplanesSchema.findOne({ _id: req.params.id });
        if (plane) {
            for (let i = 0; i < plane.images.length; i++) {
                await deleteImage(plane.images[i].public_id);
            }
            await buyplanesSchema.findByIdAndDelete(req.params.id);
            res.status(200).json(plane);
        } else {
            res.status(404).json({ error: "plane not found" });
        }
    } catch (error) {
        res.status(400).json({ error: error });
    }
};


module.exports = deletePlaneById;