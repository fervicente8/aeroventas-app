const usersSchema = require("../../models/users.js");

const createUser = async (req, res) => {
    const user = new usersSchema(req.body);
    const existingUser = await usersSchema.findOne({ email: user.email });

    try {
        if (!existingUser) {
            await user.save();
            res.json(user);
        } else if (existingUser.idGoogle !== user.idGoogle) {
            await usersSchema.findByIdAndUpdate(existingUser._id, {
                $set: { idGoogle: user.idGoogle }
            });
            res.json(user);
        } else {
            res.json(user);
        }
    } catch (error) {
        res.json({ error: error.message });
    }
};

module.exports = createUser;
