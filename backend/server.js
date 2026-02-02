const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Loads your API keys from the .env file

// Import the routes from your routes folder
const { botRouter } = require('./routes/botRoutes'); 

const app = express();

// --- MIDDLEWARE ---
app.use(cors());          // Allows your React frontend to talk to this backend
app.use(express.json());  // Allows the backend to read JSON data sent from the frontend

// --- ROUTES ---

// 1. Home Route (This fixes the "Cannot GET /" error)
app.get('/', (req, res) => {
  res.send('<h1>🚀 AI Academy Backend is Live!</h1><p>The server is running correctly.</p>');
});

// 2. AI Bot Routes
// Any request starting with /api (like http://localhost:5000/api/chat) goes here
app.use('/api', botRouter);

// 3. 404 Catch-all (For when a user types a wrong URL)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// --- ERROR HANDLING ---
// This prevents the whole server from crashing if there's a code error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong on our end!' });
});

// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n=========================================`);
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
  console.log(`✅ Press Ctrl+C to stop the server`);
  console.log(`=========================================\n`);
});