const Trip = require("../models/trip");
const geolib = require("geolib");
const csv = require("csv-parser");
const fs = require("fs");

const uploadTrip = async (req, res) => {
  const { userId } = req.body;

  if (!userId || !req.file) {
    return res.status(400).json({ message: "User ID and file are required." });
  }

  const gpsData = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => {
      const latitude = parseFloat(data.latitude);
      const longitude = parseFloat(data.longitude);
      const timestamp = new Date(data.timestamp);

      // Validation for latitude, longitude, and timestamp
      if (isNaN(latitude) || isNaN(longitude) || isNaN(timestamp.getTime())) {
        return res.status(400).json({ message: "Invalid GPS data." });
      }

      gpsData.push({ latitude, longitude, timestamp });
    })
    .on("end", async () => {
      // Calculate distance and durations (similar to previous logic)

      const trip = new Trip({
        userId,
        gpsData,
        distance: totalDistance,
        idlingDuration,
        stoppageDuration,
      });
      await trip.save();
      res.status(201).json(trip);
    })
    .on("error", (error) => {
      res.status(500).json({ message: "Error processing the file", error });
    });
};

// Get trips by user with error handling
const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.user.id });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: "Error fetching trips", error });
  }
};

module.exports = { uploadTrip, getTrips };
