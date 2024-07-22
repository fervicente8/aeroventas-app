const storeSchema = require("../../models/store.js");

const addCatById = async (req, res) => {
    const { parentId, id, name, subcategories } = req.body;
    try {
        const store = await storeSchema.findOne();

        if (!store) {
            return res.status(404).json({ error: "Store not found" });
        }

        const addSubcategory = (categories) => {
            for (let i = 0; i < categories.length; i++) {
                if (categories[i].id === parentId) {
                    if (subcategories) {
                        categories[i].subcategories.push({ id: id, name, subcategories });
                    }
                    return;
                } else if (categories[i].subcategories && categories[i].subcategories.length > 0) {
                    addSubcategory(categories[i].subcategories);
                } else {
                    continue
                }
            }
        }

        if (!parentId) {
            store.categories.push({ id, name, subcategories, visible: true });
        } else {
            addSubcategory(store.categories);
        }

        await storeSchema.findOneAndUpdate({}, { categories: store.categories }, { new: true, upsert: true });

        res.status(200).json({ id, categories: store.categories });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = addCatById;