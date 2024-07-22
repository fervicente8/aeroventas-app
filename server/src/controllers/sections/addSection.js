const sectionSchema = require("../../models/sections.js");
const { uploadImage } = require("../../utils/cloudinary.js");
const fs = require('fs-extra')

const addSection = async (req, res) => {
    const section = new sectionSchema(req.body);
    try {
        if (section.type === "personalized" || section.type === "carousel") {
            const imagesFiles = req.files || [];
            const filesArray = Object.values(imagesFiles).map((file, index) => ({
                ...file
            }));
            if (filesArray.length > 0) {
                const uploadPromises = filesArray.map((file) => uploadImage(file.tempFilePath));
                const results = await Promise.all(uploadPromises);
                section.images = results;
                await section.save();
                for (let i = 0; i < filesArray.length; i++) {
                    fs.remove(filesArray[i].tempFilePath, (err) => {
                        if (err) {
                            console.error("File not deleted:", err);
                        }
                    });
                }
                res.status(200).json(section);
            } else {
                res.status(400).json({ error: "image not found" });
            }
        } else {
            await section.save();
            res.status(200).json(section);
        }
    } catch (error) {
        res.status(400).json({ error: error });
    }
};

module.exports = addSection;