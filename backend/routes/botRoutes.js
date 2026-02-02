const express = require('express');
const router = express.Router();
const { generateBotResponse } = require('../services/aiService');

// This matches the "/chat" part of your fetch URL
router.post('/chat', async (req, res) => {
  try {
    const { personality, message } = req.body;
    
    // Call the AI service
    const reply = await generateBotResponse(personality, message);
    
    // Send the reply back to the frontend
    res.json({ reply });
  } catch (error) {
    console.error("Route Error:", error);
    res.status(500).json({ error: "Failed to get AI response" });
  }
});

// IMPORTANT: Export it as an object that matches your server.js import
module.exports = { botRouter: router };