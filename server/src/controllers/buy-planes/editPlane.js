const buyplanesSchema = require("../../models/buy-planes.js");
const { uploadPlaneImage, deleteImage } = require("../../utils/cloudinary.js");
const fs = require('fs-extra')

const editPlane = async (req, res) => {
    const { airplane, oldImages, imagesToDelete } = req.body;
    const airplaneObj = JSON.parse(airplane);
    const oldImagesArray = JSON.parse(oldImages);
    const imagesToDeleteArray = JSON.parse(imagesToDelete);

    const airplaneImages = req.files;

    try {
        let totalPlaneImages = oldImagesArray;
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
            totalPlaneImages = [...totalPlaneImages, ...planeImagesPromise];
        }

        if (imagesToDeleteArray.length > 0) {
            const deletePromises = imagesToDeleteArray.map(async (key) => {
                await deleteImage(key.public_id);
            });
            await Promise.all(deletePromises);
        }

        airplaneObj.images = totalPlaneImages;
        await buyplanesSchema.findOneAndUpdate(
            { _id: airplaneObj._id },
            {
                $set:
                {
                    model: airplaneObj.model,
                    category: airplaneObj.category,
                    brand: airplaneObj.brand,
                    price: airplaneObj.price,
                    total_hours: airplaneObj.total_hours,
                    remainder_motor_hours: airplaneObj.remainder_motor_hours,
                    remainder_propeller_hours: airplaneObj.remainder_propeller_hours,
                    engine_model: airplaneObj.engine_model,
                    manufacture_year: airplaneObj.manufacture_year,
                    documentation_status: airplaneObj.documentation_status,
                    description: airplaneObj.description,
                    images: totalPlaneImages,
                    status: airplaneObj.status
                }
            }
        )

        res.status(200).json(airplaneObj);
    } catch (error) {
        res.status(400).json({ error: error });
        console.log(error);
    }
};

module.exports = editPlane;