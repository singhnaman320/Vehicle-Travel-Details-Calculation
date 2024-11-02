const express = require('express');
const { uploadTrip, getTrips, deleteTrip } = require('../controllers/tripController');
const multer = require('multer');
const { protect } = require("../middleware/auth");
const upload = multer({ dest: 'uploads/' });
const router = express.Router();
const tripController = require("../controllers/tripController")

router.post('/upload', protect, upload.single('file'), uploadTrip);
router.get('/', protect, getTrips);
router.delete('/:tripId', protect, deleteTrip);
router.get('/:tripId', protect, tripController.getTripById);


module.exports = router;
