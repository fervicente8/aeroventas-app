const usersSchema = require("../../models/users.js");

const changeDocumentStatusById = async (req, res) => {
    const { userId, documentId, status } = req.body;

    let user = await usersSchema.findById(userId);

    if (!user) {
        return res.status(404).json({ error: "user_not_found" });
    }

    try {
        let document = user.documents.find((doc) => doc._id.toString() === documentId);

        if (!document) {
            return res.status(404).json({ error: "document_not_found" });
        }

        document.status = status;

        user.documents = user.documents.map((doc) => {
            if (doc._id === documentId) {
                return document;
            } else {
                return doc;
            }
        });

        await usersSchema.findByIdAndUpdate(userId, {
            $set: { documents: user.documents },
        });

        res.status(200).json(user.documents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = changeDocumentStatusById;
