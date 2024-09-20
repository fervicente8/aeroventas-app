const usersSchema = require("../../models/users.js");

const searchUser = async (req, res) => {
    const { search, currentLength } = req.body

    try {
        const usersFinded = await usersSchema.find({ $or: [{ name: { $regex: search, $options: 'i' } }, { last_name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }, { type: { $regex: search, $options: 'i' } }] });

        const users = usersFinded.slice(currentLength, currentLength + 15)
        const totalPages = Math.ceil(usersFinded.length / 15)

        res.status(200).json({ users, totalPages });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = searchUser