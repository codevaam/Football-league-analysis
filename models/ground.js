const mongoose = require("mongoose");

const ground = new mongoose.Schema({
    Name: {type: String, required: true},
    groundID: {type: Number, unique: true, required: true},
    city: {type: String, required: true},
    capacity: {type: Number},
    location: {
        latitude: Number,
        longitude: Number
    }
});


const Ground = mongoose.model("Ground", ground);

exports.getGroundById = async function (id) {
    return await Ground.findOne({ID: id}).exec();
}

exports.insertGround = async function (name, ID, city, capacity, location) {
    const newGround = new Ground({
        Name: name,
        groundID: ID,
        city: city,
        capacity: capacity,
        location: location 
    });

    await newGround.save();
}
