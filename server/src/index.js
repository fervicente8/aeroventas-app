const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const routes = require('./routes.js');
const cors = require('cors');
const fileUpload = require('express-fileupload');
require('dotenv').config();

// Crea un servidor Express
const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: './uploads/'
}));

// Configuraciones
app.use(cors({ origin: ['url/app-web', 'http://localhost:8081', 'http://10.0.2.2:8081'] }));
app.use("/", routes);

// Inicia el servidor
app.listen(3001);

// MongoDB conexion
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB_URI).then(() => console.log("Connected to DB Atlas")).catch((err) => console.log(err));

module.exports = app