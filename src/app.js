// Creation and configuration of the Express APP
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit"); 

const app = express();

app.use(helmet());

app.use(express.json());
app.use(cors());

app.use(express.static("public/logo"));

// add node-cron for scheduled tasks
require('./config/cron');

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many requests from this IP, please try again after 15 minutes.",
});

app.use('/api', apiLimiter, require('./routes/api.routes'));

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        message: "Not found"
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message });
});

module.exports = app;
