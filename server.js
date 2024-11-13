const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const session = require('express-session');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log("MongoDB connection error:", err));

// Import User model
const User = require('./models/User');

// Signup Route
app.post('/signup', (req, res) => {
    const { name, email, phone, password } = req.body;

    // Hash the password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return res.status(500).send('Error hashing password');

        const newUser = new User({ name, email, phone, password: hashedPassword });

        newUser.save()
            .then(user => res.json({ success: true, message: 'User created successfully' }))
            .catch(err => res.status(500).json({ success: false, message: 'Signup failed' }));
    });
});

// Login Route
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    User.findOne({ email })
        .then(user => {
            if (!user) return res.json({ success: false, message: 'User not found' });

            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) return res.status(500).send('Error comparing passwords');
                if (!isMatch) return res.json({ success: false, message: 'Invalid credentials' });

                req.session.user = user;
                res.json({ success: true, message: 'Logged in successfully' });
            });
        })
        .catch(err => res.status(500).json({ success: false, message: 'Login failed' }));
});

// Dashboard Route (Protected)
app.get('/dashboard', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/');
    }
    res.sendFile(__dirname + '/public/dashboard.html');
});

// Logout Route
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ success: false, message: 'Logout failed' });
        res.json({ success: true, message: 'Logged out successfully' });
    });
});

// Serve the app
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
