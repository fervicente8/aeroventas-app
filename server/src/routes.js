const express = require('express');
const router = express.Router();

// Controladores
const createUser = require("./controllers/users/createUser");
const findCurrentUser = require('./controllers/users/findCurrentUser');
const getAllPlanes = require('./controllers/buy-planes/getAllPlanes');
const addPlane = require('./controllers/buy-planes/addPlane');
const deletePlane = require('./controllers/buy-planes/deletePlane');
const editPlane = require('./controllers/buy-planes/editPlane');
const getPlaneById = require('./controllers/buy-planes/getPlaneById');

// Rutas
router.get('/get-all-buy-planes', getAllPlanes)
router.get('/get-plane-by-id/:id', getPlaneById)

router.post('/create-user', createUser)
router.post('/add-buy-plane', addPlane)

router.put('/find-user-by-google-id', findCurrentUser)
router.put('/edit-buy-plane', editPlane)

router.delete('/delete-buy-plane/:id', deletePlane)

module.exports = router