const userSchema = require("../../models/users.js");

const getUserDocuments = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await userSchema.findById(id);

        if (!user) {
            return res.status(404).json({ error: "user_not_found" });
        }

        res.status(200).json(user.documents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = getUserDocuments;