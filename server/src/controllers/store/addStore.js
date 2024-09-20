const storeSchema = require("../../models/store.js");

const addStore = async (req, res) => {
    const { name, email, phone, whatsapp_phone } = req.body;

    try {
        const store = new storeSchema({
            name,
            email,
            phone,
            whatsapp_phone
        });
        await store.save();
        res.status(200).json(store);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = addStore