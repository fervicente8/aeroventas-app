const storeSchema = require("../../models/store.js");

const deleteCatById = async (req, res) => {
    const { id } = req.params;

    try {
        const store = await storeSchema.findOne();
        let categoriesUpdated = store.categories;
        let deleted = false;

        if (!store) {
            return res.status(404).json({ error: "Store not found" });
        }

        const deleteCategory = (categories) => {
            for (let i = 0; i < categories.length; i++) {
                if (categories[i].id === id) {
                    categories.splice(i, 1);
                    deleted = true;
                    return;
                } else if (categories[i].subcategories && categories[i].subcategories.length > 0) {
                    deleteCategory(categories[i].subcategories);
                } else {
                    continue
                }
            }
        }

        deleteCategory(categoriesUpdated);

        if (!deleted) {
            return res.status(404).json({ error: "Category not found" });
        }

        await storeSchema.findOneAndUpdate({ "_id": store._id }, { categories: categoriesUpdated }, { new: true, upsert: true });

        return res.status(200).json(store.categories);

    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

module.exports = deleteCatById;

