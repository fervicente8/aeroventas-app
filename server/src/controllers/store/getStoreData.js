const storeSchema = require("../../models/store.js");
const sectionSchema = require("../../models/sections.js");

const getStoreData = async (req, res) => {
    try {
        const store = await storeSchema.findOne();
        const sections = await sectionSchema.find();
        res.status(200).json({ store, sections });
    } catch (error) {
        res.status(400).json({ error: error });
    }
};

module.exports = getStoreData;