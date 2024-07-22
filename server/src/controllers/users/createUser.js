const usersSchema = require("../../models/users.js");
const { uploadImage } = require("../../utils/cloudinary.js");
const fs = require('fs-extra')
const bcrypt = require('bcryptjs');

const createUser = async (req, res) => {
    const user = new usersSchema(req.body);
    const profilePicture = req.files.profile_picture;
    const existingUser = await usersSchema.findOne({ email: user.email });

    try {
        if (!existingUser) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            if (profilePicture) {
                const result = await uploadImage(profilePicture.tempFilePath);
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
        }

        res.json(user);

    } catch (error) {
        if (profilePicture) {
            await fs.remove(profilePicture.tempFilePath);
        }
        res.json({ error: error.message });
    }
};

module.exports = createUser;
