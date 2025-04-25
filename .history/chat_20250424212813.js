const { GoogleGenerativeAI } = require("@google/generative-ai");
import dotenv from 'dotenv';
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run() {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "Oii adoro viajar" }],
      },
      {
        role: "model",
        parts: [{ text: "Legal, para onde deseja viajar?" }],
      },
    ],
    generationConfig: {
      maxOutputTokens: 100,
    },
  });

  const msg = "Quero ir para o Canadá";

  const result = await chat.sendMessage(msg);
  const response = await result.response;
  const text = response.text();
  console.log(text);
}

run();