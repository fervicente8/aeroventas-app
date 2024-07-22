const usersSchema = require("../../models/users.js");

const findCurrentUser = async (req, res) => {
    const { idGoogle } = req.body;
    const userByGoogleId = await usersSchema.findOne({ idGoogle });

    try {
        res.json(userByGoogleId);
    } catch (error) {
        res.json({ error: error.message });
    }
};

module.exports = findCurrentUser;