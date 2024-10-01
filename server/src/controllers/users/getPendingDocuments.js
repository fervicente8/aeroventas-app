const userSchema = require("../../models/users.js");

const getPendingDocuments = async (req, res) => {
    try {
        const allUsers = await userSchema.find();

        const pendingDocuments = allUsers
            .flatMap((user) =>
                user.documents
                    .filter((document) => document.status === "pending")
                    .map((document) => ({
                        _id: user._id,
                        document
                    }))
            );

        res.status(200).json(pendingDocuments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = getPendingDocuments;