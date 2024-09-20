const usersSchema = require("../../models/users.js");
const { uploadProfileImage, deleteImage } = require("../../utils/cloudinary.js");
const fs = require('fs-extra');
const bcrypt = require('bcryptjs');

const editUser = async (req, res) => {
    const { user_id, to_edit, data, image_delete_id } = req.body;
    let newProfilePicture

    if (to_edit === 'profile_picture') {
        newProfilePicture = req.files?.image;
    }

    const user = await usersSchema.findById(user_id);

    if (!user) {
        return res.status(404).json({ error: "user_not_found" });
    }

    try {
        if (to_edit === 'profile_picture') {
            if (newProfilePicture && image_delete_id) {
                const result = await uploadProfileImage(newProfilePicture.tempFilePath);
                await deleteImage(image_delete_id);

                await usersSchema.findByIdAndUpdate(user_id, {
                    profile_picture:
                        { public_id: result.public_id, secure_url: result.secure_url }
                });

                user.profile_picture = {
                    public_id: result.public_id,
                    secure_url: result.secure_url
                };

                await fs.remove(newProfilePicture.tempFilePath);
            } else {
                return res.status(400).json({ error: "profile_picture_not_found" });
            }
        } else if (to_edit === "password") {
            const validPassword = await bcrypt.compare(req.body.data.actualPassword, user.password);

            if (!validPassword) {
                return res.status(401).json({ error: "invalid_password" });
            } else {
                const hashedPassword = await bcrypt.hash(req.body.data.newPassword, 10);
                await usersSchema.findByIdAndUpdate(user_id, { password: hashedPassword });
            }

        } else {
            await usersSchema.findByIdAndUpdate(user_id, { [to_edit]: data });

            user[to_edit] = data
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = editUser;
