const express = require('express');
const { uploadTrip, getTrips } = require('../controllers/tripController');
const multer = require('multer');
const { protect } = require("./../middleware/auth.js");
const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.post('/upload',protect, upload.single('file'), uploadTrip);
router.get('/', getTrips);

module.exports = router;
