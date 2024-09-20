const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true,
});

const uploadPlaneImage = async (filePath) => {
    return await cloudinary.uploader.upload(filePath, {
        folder: "aeroventas/aeroventas-planes",
    });
};

const uploadProfileImage = async (filePath) => {
    return await cloudinary.uploader.upload(filePath, {
        folder: "aeroventas/aeroventas-users",
    });
};

const uploadDocumentImage = async (filePath) => {
    return await cloudinary.uploader.upload(filePath, {
        folder: "aeroventas/aeroventas-documents",
    });
};

const deleteImage = async (public_id) => {
    return await cloudinary.uploader.destroy(public_id);
};

module.exports = { uploadPlaneImage, uploadProfileImage, uploadDocumentImage, deleteImage };
