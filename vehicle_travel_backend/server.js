// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const connectDB = require('./config/db');
// const tripRoutes = require('./routes/tripRoutes');
// const authRoutes = require('./routes/authRoutes'); // Import auth routes
// require('dotenv').config();

// const app = express();
// connectDB();
// app.use(cors({
//     origin: 'http://localhost:5173', // your Vite server's URL
//     credentials: true, // allow credentials if needed
//   }));
// app.use(express.json());

// app.use('/api/trips', tripRoutes);
// app.use('/api/auth', authRoutes); // Use auth routes

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');
const tripRoutes = require('./routes/tripRoutes');
const authRoutes = require('./routes/authRoutes');
const { protect } = require('./middleware/auth');
require('dotenv').config();

const app = express();
connectDB();
app.use(cors());
app.use(express.json());
app.use('/api/trips', protect, tripRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

