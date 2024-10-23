const usersSchema = require("../../models/users.js");

const changeDocumentStatusById = async (req, res) => {
    const { userId, documentId, status, expirationDate, licenseNumber, reviewerId, rejectReason } = req.body;

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

        if (status === "accepted") {
            document.reviewer_id = reviewerId;
            document.expiration_date = expirationDate;
        }
        if (status === "rejected") {
            document.reject_reason = rejectReason;
        }
        if (status === "pending" || status === "rejected") {
            document.reviewer_id = reviewerId;
            document.license_number = null;
            document.expiration_date = null;
        }

        if (document.type === "license") {
            document.license_number = licenseNumber;
        }

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
