const storeSchema = require("../../models/store.js");

const getStore = async (req, res) => {
    try {
        const store = await storeSchema.find()

        if (store.length === 0) return res.status(404).json({ error: 'store_not_found' })
        res.status(200).json(store)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = getStore