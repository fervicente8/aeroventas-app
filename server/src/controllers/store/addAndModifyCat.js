const storeSchema = require("../../models/store.js");

const addAndModifyCat = async (req, res) => {
    const storeCategories = req.body;
    try {
        const updatedStore = await storeSchema.findOneAndUpdate(
            {},
            { categories: storeCategories },
            { new: true, upsert: true }
        );

        if (!updatedStore) {
            return res.status(404).json({ error: "Store not found" });
        }

        res.status(200).json(updatedStore.categories);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = addAndModifyCat;

