const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tripName: { type: String, required: true },
    gpsData: { type: Array, required: true },
    distance: { type: Number, default: 0 },
    duration: { type: Number, default: 0 },
    idlingDuration: { type: Number, default: 0 },
    stoppageDuration: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Trip', TripSchema);
