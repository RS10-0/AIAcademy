const express = require('express');
const cors = require('cors');
require('dotenv').config();

// 1. Double-check this path and variable name match your botRoutes.js export
const { botRouter } = require('./routes/botRoutes'); 

const app = express();

// --- MIDDLEWARE ---
// This is essential. Without cors(), the browser blocks the frontend from talking to the backend.
app.use(cors()); 
app.use(express.json()); 

// --- ROUTES ---

// Home Route (What you see when you click the link in the terminal)
app.get('/', (req, res) => {
  res.send('<h1>🚀 AI Academy Backend is Live!</h1><p>The server is running correctly. Ready for API requests.</p>');
});

// AI Bot Routes
// This ensures http://localhost:5000/api/chat is the correct address
app.use('/api', botRouter);

// --- ERROR HANDLING ---
app.use((req, res) => {
  res.status(404).json({ message: "Route not found. Check your URL path!" });
});

app.use((err, req, res, next) => {
  console.error("Internal Server Error:", err.stack);
  res.status(500).json({ error: 'Something went wrong on the server!' });
});

// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n=========================================`);
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
  console.log(`✅ Backend is ready to receive messages!`);
  console.log(`=========================================\n`);
});