const { OpenAI } = require('openai');
require('dotenv').config();

// This uses the key from your .env file
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const generateBotResponse = async (personality, userMessage) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini", 
    messages: [
      { role: "system", content: personality }, 
      { role: "user", content: userMessage }
    ],
  });
  return response.choices[0].message.content;
};

module.exports = { generateBotResponse };