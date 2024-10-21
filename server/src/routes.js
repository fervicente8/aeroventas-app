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
const suspendUserById = require('./controllers/users/suspendUserById');
const deleteUserById = require('./controllers/users/deleteUserById');
const getUserDocuments = require('./controllers/users/getUserDocuments');
const getPendingDocuments = require('./controllers/users/getPendingDocuments');
const fetchAndSaveAirports = require('./controllers/airports/fetchAndSaveAirports');

// Rutas
router.get('/save-airports', fetchAndSaveAirports);
router.get('/get-store-data', getStore)
router.get('/get-user-by-id/:id', getUserById)
router.get('/get-all-buy-planes', getAllPlanes)
router.get('/get-plane-by-id/:id', getPlaneById)
router.get('/get-user-documents/:id', getUserDocuments)
router.get('/get-pending-documents', getPendingDocuments)

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
router.put('/suspend-user-by-id/:id', suspendUserById)

router.delete('/delete-buy-plane/:id', deletePlaneById)
router.delete('/delete-user-by-id/:id', deleteUserById)

module.exports = router