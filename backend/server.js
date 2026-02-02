const express = require('express');
const cors = require('cors');
// This line finds the file you just made in Step 2
const { botRouter } = require('./routes/botRoutes'); 

const app = express();
app.use(cors()); 
app.use(express.json());

// This tells the app: "Any URL starting with /api should use botRoutes"
app.use('/api', botRouter);

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Backend is live at http://localhost:${PORT}`));
