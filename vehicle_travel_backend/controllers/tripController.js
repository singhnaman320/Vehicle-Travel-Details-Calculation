const mongoose = require("mongoose"); 
const Trip = require("../models/trip");
const geolib = require("geolib");
const csv = require("csv-parser");
const fs = require("fs");

const uploadTrip = async (req, res) => {
  const user = req.user;
  if (!user._id || !req.file) {
    return res.status(400).json({ message: "User ID and file are required." });
  }

  // Convert `userId` to a MongoDB ObjectId if it's a valid string
  try {
    userId = user._id;
  } catch (error) {
    return res.status(400).json({ message: "Invalid User ID format." });
  }

  const gpsData = [];
  let totalDistance = 0;
  let idlingDuration = 0; // Placeholder, replace with actual calculation logic
  let stoppageDuration = 0; // Placeholder, replace with actual calculation logic

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

      // Add validated GPS data to the array
      gpsData.push({ latitude, longitude, timestamp });

      // Calculate distance if there’s more than one GPS point
      if (gpsData.length > 1) {
        const prevPoint = gpsData[gpsData.length - 2];
        const currentPoint = gpsData[gpsData.length - 1];

        const distance = geolib.getDistance(
          { latitude: prevPoint.latitude, longitude: prevPoint.longitude },
          { latitude: currentPoint.latitude, longitude: currentPoint.longitude }
        );

        totalDistance += distance;
      }
    })
    .on("end", async () => {
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
