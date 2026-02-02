const express = require('express');
const router = express.Router();
// This imports the brain logic we are about to put in services
const { generateBotResponse } = require('../services/aiService');

// This is the "address" the frontend will call
router.post('/chat', async (req, res) => {
  try {
    const { personality, message } = req.body;
    const aiResponse = await generateBotResponse(personality, message);
    res.json({ reply: aiResponse });
  } catch (error) {
    console.error("Error in /chat route:", error);
    res.status(500).json({ error: "The AI is having a nap. Try again later." });
  }
});

module.exports = { botRouter: router };