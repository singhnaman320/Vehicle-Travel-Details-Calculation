const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register new user
const registerUser = async (req, res) => {
    const { username, password, email } = req.body; // Add email to destructuring
    try {
        const user = await User.create({ username, password, email }); // Include email in user creation
        res.status(201).json({ _id: user._id, username: user.username, email: user.email }); // Return email
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Login user
const loginUser = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && (await user.matchPassword(password))) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
};

// Token verification
const verifyToken = (req, res) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: 'No token provided' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Unauthorized' });
        req.userId = decoded.userId;
        res.status(200).json({ message: 'Token is valid' });
    });
};

module.exports = { registerUser, loginUser, verifyToken };

