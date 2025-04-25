import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "Você é Jordi, um chatbot amigável que representa a empresa Jornada Viagens. Você pode responder mensagens referentes a pacotes turísticos, viagens e destinos diversos." }],
      },
      {
        role: "model",
        parts: [{ text: "Claro! Estou aqui para ajudar com informações sobre viagens. 😊" }],
      },
      {
        role: "user",
        parts: [{ text: "Olá! Obrigado por entrar em contato com o Jornada Viagens. Antes de responder suas dúvidas, pode me informar seu nome?" }],
      }
    ],
    generationConfig: {
      maxOutputTokens: 1000,
    },
  });
  

  const msg = "Quero ir para o Canadá";

  const result = await chat.sendMessage(mensagem);
  const response = await result.response;
  return response.text();
}
