const usersSchema = require("../../models/users.js");
const { uploadDocumentImage } = require("../../utils/cloudinary.js");
const fs = require('fs-extra');

const addUserDocument = async (req, res) => {
    const { user_id, type, created_at } = req.body;
    const documentImages = req.files;

    const user = await usersSchema.findById(user_id);
    if (!user) {
        return res.status(404).json({ error: "user_not_found" });
    }

    const document = {
        type,
        files_url: [],
        created_at
    };

    try {
        if (documentImages) {
            const uploadPromises = Object.keys(documentImages).map(async (key) => {
                const file = documentImages[key];
                const result = await uploadDocumentImage(file.tempFilePath);
                await fs.remove(file.tempFilePath);
                return result.secure_url;
            });

            document.files_url = await Promise.all(uploadPromises);
        } else {
            return res.status(400).json({ error: "images_not_found" });
        }

        await usersSchema.findByIdAndUpdate(user_id, { $push: { documents: document } });
        user.documents.push(document);

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = addUserDocument;
