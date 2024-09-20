const usersSchema = require("../../models/users.js");

const getUserById = async (req, res) => {
    try {
        const user = await usersSchema.findOne({ _id: req.params.id });
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = getUserById