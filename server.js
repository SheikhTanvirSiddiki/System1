const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

const User = require('./models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log("MongoDB connection error:", err));

// Routes for Login/Signup
app.post('/signup', async (req, res) => {
    const { name, email, phoneNo, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.json({ success: false, message: "User already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, phoneNo, password: hashedPassword });
    await user.save();

    res.json({ success: true, message: "Signup successful!" });
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, message: "User not found." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ success: false, message: "Invalid password." });

    res.json({ success: true, message: "Login successful!" });
});

// Dashboard route
app.get('/dashboard', (req, res) => {
    res.sendFile(__dirname + '/public/dashboard.html');
});

// Start server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
