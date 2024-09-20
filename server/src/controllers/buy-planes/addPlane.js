const buyplanesSchema = require("../../models/buy-planes.js");
const { uploadPlaneImage } = require("../../utils/cloudinary.js");
const fs = require('fs-extra')

const addPlane = async (req, res) => {
    const planeObj = JSON.parse(req.body.airplane);
    const plane = new buyplanesSchema(planeObj);
    const airplaneImages = req.files;

    try {
        if (airplaneImages) {
            const uploadPromises = Object.keys(airplaneImages).map(async (key) => {
                const file = airplaneImages[key];
                const result = await uploadPlaneImage(file.tempFilePath);
                await fs.remove(file.tempFilePath);
                return {
                    public_id: result.public_id,
                    secure_url: result.secure_url
                };
            });

            const planeImagesPromise = await Promise.all(uploadPromises);

            plane.images = planeImagesPromise;

            await plane.save();
            res.status(200).json(plane);
        } else {
            res.status(404).json({ error: "image not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

module.exports = addPlane;