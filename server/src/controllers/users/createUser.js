const usersSchema = require("../../models/users.js");
const { uploadProfileImage } = require("../../utils/cloudinary.js");
const fs = require('fs-extra');
const bcrypt = require('bcryptjs');

const createUser = async (req, res) => {
    const user = new usersSchema(req.body);
    const existingUser = await usersSchema.findOne({ email: user.email });
    const profilePicture = req.files?.image;

    try {
        if (!existingUser) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            if (profilePicture) {
                const result = await uploadProfileImage(profilePicture.tempFilePath);
                user.profile_picture = {
                    public_id: result.public_id,
                    secure_url: result.secure_url
                };
            }

            user.password = hashedPassword;
            await user.save();

            if (profilePicture) {
                await fs.remove(profilePicture.tempFilePath);
            }

            res.status(200).json(user);
        } else {
            if (profilePicture) {
                await fs.remove(profilePicture.tempFilePath);
            }
            return res.status(409).json({ error: "User already exists" });
        }
    } catch (error) {
        if (profilePicture) {
            await fs.remove(profilePicture.tempFilePath);
        }
        res.status(500).json({ error: error.message });
    }
};

module.exports = createUser;
