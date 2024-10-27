// const Trip = require('../models/Trip');
// const geolib = require('geolib');
// const csv = require('csv-parser');
// const fs = require('fs');

// const uploadTrip = async (req, res) => {
//     const { userId } = req.body;
//     const gpsData = [];

//     // Validate file existence
//     if (!req.file) {
//         return res.status(400).json({ message: "No file uploaded" });
//     }

//     // Read and parse CSV file
//     try {
//         fs.createReadStream(req.file.path)
//             .pipe(csv())
//             .on('data', (data) => {
//                 // Validate GPS data
//                 const latitude = parseFloat(data.latitude);
//                 const longitude = parseFloat(data.longitude);
//                 const timestamp = new Date(data.timestamp);
//                 if (isNaN(latitude) || isNaN(longitude) || isNaN(timestamp)) {
//                     throw new Error("Invalid GPS data in file");
//                 }
//                 gpsData.push({ latitude, longitude, timestamp });
//             })
//             .on('end', async () => {
//                 let totalDistance = 0;
//                 let idlingDuration = 0;
//                 let stoppageDuration = 0;

//                 gpsData.forEach((point, i) => {
//                     if (i > 0) {
//                         const prevPoint = gpsData[i - 1];
//                         const distance = geolib.getDistance(
//                             { latitude: prevPoint.latitude, longitude: prevPoint.longitude },
//                             { latitude: point.latitude, longitude: point.longitude }
//                         );

//                         const timeDiff = (point.timestamp - prevPoint.timestamp) / 1000;

//                         if (distance === 0) {
//                             idlingDuration += timeDiff;
//                         } else if (timeDiff > 60 && distance / timeDiff < 0.5) {
//                             stoppageDuration += timeDiff;
//                         }

//                         totalDistance += distance;
//                     }
//                 });

//                 const trip = new Trip({
//                     userId,
//                     gpsData,
//                     distance: totalDistance,
//                     idlingDuration,
//                     stoppageDuration,
//                 });

//                 await trip.save();
//                 res.status(201).json(trip);
//             });
//     } catch (error) {
//         res.status(500).json({ message: "Error processing file", error: error.message });
//     }
// };

// const getTrips = async (req, res) => {
//     const { page = 1, limit = 10, sortBy = 'date', order = 'desc' } = req.query;

//     const sortOptions = {
//         date: { createdAt: order === 'desc' ? -1 : 1 },
//         distance: { distance: order === 'desc' ? -1 : 1 },
//     };

//     try {
//         const trips = await Trip.find({ userId: req.user.id })
//             .sort(sortOptions[sortBy])
//             .skip((page - 1) * limit)
//             .limit(parseInt(limit));

//         const total = await Trip.countDocuments({ userId: req.user.id });

//         res.json({
//             trips,
//             totalPages: Math.ceil(total / limit),
//             currentPage: parseInt(page),
//         });
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching trips", error: error.message });
//     }
// };

// module.exports = { uploadTrip, getTrips };

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

// Function to get trips by user with error handling
const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.user.id });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: "Error fetching trips", error });
  }
};

module.exports = { uploadTrip, getTrips };
