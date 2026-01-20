const express = require('express');
// This serves your website files to the internet
app.use(express.static('frontend'));
const app = express();
const PORT = 3000;

// 1. Allow the server to read JSON data (Crucial for chat apps)
app.use(express.json()); 
app.use(express.static('public'));

// 2. Create the "Chat" Endpoint
app.post('/api/chat', (req, res) => {
    const userMessage = req.body.message;
    console.log("User sent:", userMessage); // This shows in your VS Code terminal

    // Simple "Fake AI" Logic (We will replace this with real AI later)
    let botReply = "I am a server. I don't know that answer yet.";

    if (userMessage.toLowerCase().includes("hello")) {
        botReply = "Hello! I am your Study Helper Server.";
    } else if (userMessage.toLowerCase().includes("math")) {
        botReply = "I can help with Math! What is the problem?";
    }

    // Send the answer back to the browser
    res.json({ reply: botReply });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});