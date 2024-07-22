const express = require('express');
const router = express.Router();

// Controladores
const getStoreData = require('./controllers/store/getStoreData');
const getAllProducts = require('./controllers/products/getAllProducts');
const createUser = require("./controllers/users/createUser");
const findCurrentUser = require('./controllers/users/findCurrentUser');
const addStoreData = require('./controllers/store/addStoreData');
const addAndModifyCat = require('./controllers/store/addAndModifyCat');
const addSection = require('./controllers/sections/addSection');
const addProduct = require('./controllers/products/addProduct');
const editProduct = require('./controllers/products/editProduct');
const deleteProduct = require('./controllers/products/deleteProduct');
const deleteCatById = require('./controllers/store/deleteCatById');
const addCatById = require('./controllers/store/addCatById');
const getProductById = require('./controllers/products/getProductById');

// Rutas
router.get('/get-store-data', getStoreData)
router.get('/get-store-products', getAllProducts)
router.get('/get-product-by-id/:id', getProductById)

router.post('/create-user', createUser)
router.post('/add-product', addProduct)
router.post('/add-store-data', addStoreData)
router.post('/add-section', addSection)

router.put('/find-user-by-google-id', findCurrentUser)
router.put('/add-modify-cat', addAndModifyCat)
router.put('/edit-product', editProduct)
router.put('/add-cat-by-id', addCatById)

router.delete('/delete-product/:id', deleteProduct)
router.delete('/delete-cat-by-id/:id', deleteCatById)

module.exports = router