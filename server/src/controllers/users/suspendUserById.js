const usersSchema = require("../../models/users.js");

const suspendUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await usersSchema.findById(id);

        if (!user) {
            return res.status(404).json({ error: "user_not_found" });
        }

        if (user.status === "suspended") {
            await usersSchema.findByIdAndUpdate(id, {
                $set: { status: "active" },
            });
        } else {
            await usersSchema.findByIdAndUpdate(id, {
                $set: { status: "suspended" },
            });
        }

        user.status = user.status === "suspended" ? "active" : "suspended";

        res.status(200).json(user.status);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = suspendUserById;
