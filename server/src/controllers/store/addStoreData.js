const storeSchema = require("../../models/store.js");

const addStoreData = async (req, res) => {
    const store = new storeSchema(req.body);
    try {
        await store.save();
        res.status(200).json(store);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = addStoreData;
