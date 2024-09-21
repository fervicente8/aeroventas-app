const express = require('express');
const router = express.Router();

// Controladores
const createUser = require("./controllers/users/createUser");
const loginUser = require('./controllers/users/loginUser');
const getAllPlanes = require('./controllers/buy-planes/getAllPlanes');
const addPlane = require('./controllers/buy-planes/addPlane');
const deletePlaneById = require('./controllers/buy-planes/deletePlaneById');
const editPlane = require('./controllers/buy-planes/editPlane');
const getPlaneById = require('./controllers/buy-planes/getPlaneById');
const addUserDocument = require('./controllers/users/addUserDocument');
const getUserById = require('./controllers/users/getUserById');
const editUser = require('./controllers/users/editUser');
const getStore = require('./controllers/store/getStore');
const editStore = require('./controllers/store/editStore');
const addStore = require('./controllers/store/addStore');
const searchUser = require('./controllers/users/searchUser');
const changeDocumentStatusById = require('./controllers/users/changeDocumentStatusById');

// Rutas
router.get('/get-store-data', getStore)
router.get('/get-user-by-id/:id', getUserById)
router.get('/get-all-buy-planes', getAllPlanes)
router.get('/get-plane-by-id/:id', getPlaneById)

router.post('/create-store', addStore)
router.post('/create-user', createUser)
router.post('/add-buy-plane', addPlane)

router.put('/edit-store-data', editStore)
router.put('/add-user-document', addUserDocument)
router.put('/login-user', loginUser)
router.put('/edit-buy-plane', editPlane)
router.put('/edit-user', editUser)
router.put('/search-user-by-term', searchUser)
router.put('/update-document-status', changeDocumentStatusById)

router.delete('/delete-buy-plane/:id', deletePlaneById)

module.exports = router