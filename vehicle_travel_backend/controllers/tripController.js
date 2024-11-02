const mongoose = require("mongoose"); 
const Trip = require("../models/trip");
const geolib = require("geolib");
const csv = require("csv-parser");
const fs = require("fs");

const uploadTrip = async (req, res) => {
  const user = req.user;
  if (!user._id || !req.file || !req.body.tripName) {
    return res.status(400).json({ message: "User ID, trip name, and file are required." });
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

      // Validate GPS data
      if (isNaN(latitude) || isNaN(longitude) || isNaN(timestamp.getTime())) {
        return res.status(400).json({ message: "Invalid GPS data." });
      }

      gpsData.push({ latitude, longitude, timestamp });

      // Calculate distance
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
        userId: user._id,
        tripName: req.body.tripName,
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

const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.user._id });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: "Error fetching trips", error });
  }
};

const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({ _id: req.params.tripId, userId: req.user._id });
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    res.json({ message: "Trip deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting trip", error });
  }
};

module.exports = { uploadTrip, getTrips, deleteTrip };
