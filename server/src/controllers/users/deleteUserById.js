const usersSchema = require("../../models/users.js");

const deleteUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await usersSchema.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ error: "user_not_found" });
        }

        res.status(200).json({ message: "user_deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = deleteUserById;
