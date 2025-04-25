import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function executaChat(mensagem) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

  const chat = model.startChat({
    history: [
        {
            role: "user",
            parts: [{ text: "Você é Jordi, um chatbot amigável que representa a empresa Jornada Viagens. Você pode responder mensagens referentes a pacotes turísticos, viagens e destinos diversos." }],
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