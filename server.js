const express = require('express');
const app = express(); // 1. Create the app FIRST
const PORT = process.env.PORT || 3000; // 2. Use the flexible Port

app.use(express.json());

// 3. Serve the 'public' folder (this is where your index.html is)
app.use(express.static('public'));

// 4. The Chat Endpoint
app.post('/api/chat', (req, res) => {
    const userMessage = req.body.message; 
    console.log("User sent:", userMessage);

    let botReply = "I am a server. I don't know AI yet.";

    if (userMessage && userMessage.toLowerCase().includes("hello")) {
        botReply = "Hello! I am your Study Helper.";
    }

    res.json({ reply: botReply });
});

// 5. Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});