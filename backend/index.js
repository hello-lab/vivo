const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

app.use(bodyParser.json());

const db = new sqlite3.Database('database.db');

db.serialize(() => {
  //  db.run("CREATE TABLE users (username TEXT, email TEXT, password TEXT)");
});

// Register route
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    // Check if username or email already exists
    db.get("SELECT * FROM users WHERE username = ? OR email = ?", [username, email], async (err, user) => {
        if (err) {
            return res.send({data: 'Error checking existing user'});
        }
        if (user) {
            return res.send({data: 'Username or email already exists'});
        }

        // Sanitize input
        const sanitizedUsername = username.replace(/[^a-zA-Z0-9]/g, '');
        const sanitizedEmail = email.replace(/[^a-zA-Z0-9@.]/g, '');

        const hashedPassword = await bcrypt.hash(password, 10);
        db.run("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [sanitizedUsername, sanitizedEmail, hashedPassword], function(err) {
            if (err) {
                return res.send({data: 'Error registering user'});
            }
            res.send({data: 'User registered'});
        });
    });
});

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
        if (err) {
            return res.send({data:'Error logging in'});
        }
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ username: user.username }, 'secret_key', { expiresIn: '1h' });
            res.json({ token });
        } else {
            res.send({data:'Invalid credentials'});
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
