// APPLICATION IMPORTS
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const indexRouter = require('./routes/index');

const app = express();

const corsOptions = {
	exposedHeaders: 'Authorization',
};

// APPLICATION MIDDLEWARE
app.use(express.json());
app.use(cors(corsOptions));
app.use(morgan("dev"));

// ROUTES MIDDLEWARE
app.use('/', indexRouter);

// CONNECT TO DB
connectDB();



module.exports = app;