const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Ground = require("../models/ground");

router.get("/", function (req, res) {
    res.send("Works");
});

exports.router = router;