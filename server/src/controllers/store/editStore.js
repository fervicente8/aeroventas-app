const storeSchema = require("../../models/store.js");

const editStore = async (req, res) => {
    const { _id, type, newValue } = req.body;

    try {
        const store = await storeSchema.findByIdAndUpdate(_id, {
            $set: { [type]: newValue },
        });
        res.status(200).json(store);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = editStore;