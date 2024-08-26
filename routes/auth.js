// auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();

// Register

router.post('/register', (req, res) => {
    const { username, email, contact, password } = req.body;

    const hashedPassword = bcrypt.hashSync(password, 8);

    const sql = 'INSERT INTO UserDetails (username, email, contact, password) VALUES (?, ?, ?, ?)';
    db.query(sql, [username, email, contact, hashedPassword], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        res.status(200).json({ message: 'User registered successfully' });
    });
});

// Login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    const sql = 'SELECT * FROM UserDetails WHERE email = ?';
    db.query(sql, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }

        if (results.length === 0) {
            return res.status(400).json({ message: 'User not found' });
        }

        const user = results[0];
        const isPasswordValid = bcrypt.compareSync(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ id: user.id }, 'secret', { expiresIn: 86400 });

        res.status(200).json({ message: 'Login successful', token });
    });
});

module.exports = router;
