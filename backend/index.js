const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const { GoogleGenAI } = require('@google/genai');
const  fs =require("node:fs");
const app = express();
const port = 3000;

app.use(bodyParser.json());

const db = new sqlite3.Database('database.db');

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password TEXT
  )
`);

const ai = new GoogleGenAI({ apiKey: 'AIzaSyBm_lb6U_KnzPcw5XaxwI7VdQYCW0DNb40' });

// Register route
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  db.get("SELECT * FROM users WHERE username = ? OR email = ?", [username, email], async (err, user) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (user) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    db.run("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [username, email, hashedPassword], err => {
      if (err) return res.status(500).json({ error: 'Registration failed' });
      res.json({ message: 'User registered' });
    });
  });
});

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
    if (err || !user) return res.status(400).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });

    res.json({ message: 'Login successful' });
  });
});

// Public AI image generation
app.post("/gemini/generate", async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt) return res.status(400).json({ error: "Missing prompt." });
  
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp-image-generation",
        contents: prompt,
        config: {
            responseModalities: ["Text", "Image"],
        },
      });
  
      for (const part of response.candidates[0].content.parts) {
        // Based on the part type, either show the text or save the image
        if (part.text) {
          console.log(part.text);
        } else if (part.inlineData) {
          const imageData = part.inlineData.data;
          const buffer = Buffer.from(imageData, "base64");
          fs.writeFileSync("gemini-native-image.png", buffer);
        res.setHeader('Content-Type', 'image/png');
        //res.send(buffer);
      res.json({ image: imageData });
     }
        }
    } catch (error) {
      console.error("Gemini error:", error);
      res.status(500).json({ error: "Failed to generate image." });
    }
  });

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
