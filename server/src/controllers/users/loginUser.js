const usersSchema = require("../../models/users.js");
const bcrypt = require('bcryptjs');

const loginUser = async (req, res) => {
    try {
        const user = await usersSchema.findOne({ email: req.body.email });

        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);

        if (validPassword) {
            res.status(200).json(user);
        } else {
            res.status(401).json({ error: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = loginUser;
