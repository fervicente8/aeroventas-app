const productsSchema = require("../../models/products.js");
const { uploadImage, deleteImage } = require("../../utils/cloudinary.js");
const fs = require('fs-extra')

const editProduct = async (req, res) => {
    const product = req.body;
    const imagesFiles = req.files || [];
    const filesArray = Object.values(imagesFiles).map((file, index) => ({
        ...file
    }));
    let existingImages = JSON.parse(product.images)?.filter(image => image.file.secure_url || image.file.public_id);
    existingImages = existingImages.map(el => el.file)

    try {
        const uploadPromises = filesArray.map((file) => uploadImage(file.tempFilePath));
        let results = await Promise.all(uploadPromises);
        results = results.map(el => {
            return {
                public_id: el.public_id,
                secure_url: el.secure_url,
            }
        });
        product.images = existingImages ? [...existingImages, ...results] : results;

        await productsSchema.findOneAndUpdate(
            { _id: product._id },
            {
                $set:
                {
                    productName: product.productName,
                    productStatus: product.productStatus,
                    images: product.images,
                    description: product.description,
                    brand: product.brand,
                    price: product.price,
                    category: product.category.split(","),
                    LWH: product.lwh !== "Alto*Ancho*Largo" ? product.lwh : null,
                    weight: product.weight,
                    sku: product.sku,
                    offerStatus: product.offerStatus ? product.offerStatus : null,
                    offerPrice: product.offerPrice,
                    offerDuration: product.offerDuration,
                    stock: product.stock
                }
            }
        )

        if (product.deletedImages !== undefined) {
            let array = product.deletedImages.split(",");
            for (let i = 0; i < array.length; i++) {
                await deleteImage(array[i]);
            }
        }

        for (let i = 0; i < filesArray.length; i++) {
            fs.remove(filesArray[i].tempFilePath, (err) => {
                if (err) {
                    console.error("File not deleted:", err);
                }
            });
        }

        let allProductsUpdated = await productsSchema.find();
        res.status(200).json(allProductsUpdated);
    } catch (error) {
        for (let i = 0; i < filesArray.length; i++) {
            fs.remove(filesArray[i].tempFilePath, (err) => {
                if (err) {
                    console.error("File not deleted:", err);
                }
            });
        }
        res.status(400).json({ error: error });
    }
};

module.exports = editProduct;