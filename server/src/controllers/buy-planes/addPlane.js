const buyplanesSchema = require("../../models/buy-planes.js");
const { uploadImage } = require("../../utils/cloudinary.js");
const fs = require('fs-extra')

const addPlane = async (req, res) => {
    const product = new buyplanesSchema(req.body);
    const imagesFiles = req.files || [];
    const filesArray = imagesFiles.images

    try {
        if (filesArray.length > 0 || product._id) {
            const uploadPromises = filesArray.map((file) => {
                return uploadImage(file.tempFilePath)
            });
            const results = await Promise.all(uploadPromises);
            product.images = results;
            await product.save();
            for (let i = 0; i < filesArray.length; i++) {
                fs.remove(filesArray[i].tempFilePath, (err) => {
                    if (err) {
                        console.error("File not deleted:", err);
                    }
                });
            }
            res.status(200).json(product);
        } else {
            res.status(400).json({ error: "image not found" });
        }
    } catch (error) {
        for (let i = 0; i < filesArray.length; i++) {
            fs.remove(filesArray[i].tempFilePath, (err) => {
                if (err) {
                    console.error("File not deleted:", err);
                }
            });
        }
        res.status(400).json({ error: error });
    }
};

module.exports = addPlane;