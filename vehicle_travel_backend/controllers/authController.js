// const User = require('../models/User');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// // Register new user
// const register = async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const user = new User({ email, password: hashedPassword });
//         await user.save();
//         res.status(201).json({ message: 'User registered successfully' });
//     } catch (error) {
//         res.status(500).json({ message: 'Registration failed', error });
//     }
// };

// // Login existing user
// const login = async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         const user = await User.findOne({ email });
//         if (!user || !(await bcrypt.compare(password, user.password))) {
//             return res.status(400).json({ message: 'Invalid email or password' });
//         }

//         const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//         res.status(200).json({ token, userId: user._id });
//     } catch (error) {
//         res.status(500).json({ message: 'Login failed', error });
//     }
// };

// // Token verification
// const verifyToken = (req, res) => {
//     const token = req.headers['authorization'];
//     if (!token) return res.status(403).json({ message: 'No token provided' });

//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//         if (err) return res.status(401).json({ message: 'Unauthorized' });
//         req.userId = decoded.userId;
//         res.status(200).json({ message: 'Token is valid' });
//     });
// };

// module.exports = { register, login, verifyToken };


const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register new user
const registerUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.create({ username, password });
        res.status(201).json({ _id: user._id, username: user.username });
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

