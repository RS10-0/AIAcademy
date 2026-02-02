const { OpenAI } = require('openai');
require('dotenv').config();

// Initialize Groq using the key from the .env file
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY, 
  baseURL: "https://api.groq.com/openai/v1" 
});

/**
 * Sends a prompt to the AI and gets a response.
 * @param {string} personality - The "System Instructions"
 * @param {string} userMessage - What the user typed
 */
const generateBotResponse = async (personality, userMessage) => {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", 
      messages: [
        { 
          role: "system", 
          content: personality || "You are a helpful assistant." 
        },
        { 
          role: "user", 
          content: userMessage 
        }
      ],
      temperature: 0.7, 
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("❌ Groq API Error:", error.message);
    
    // Check if the error is due to a missing/invalid key
    if (error.status === 401) {
        return "Backend Error: API Key is missing or invalid in .env file.";
    }
    
    return "The AI is currently unavailable. Check your backend console for errors.";
  }
};

module.exports = { generateBotResponse };