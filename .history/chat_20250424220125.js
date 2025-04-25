import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function executaChat(mensagem) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});


  const result = await chat.sendMessage(mensagem);
  const response = await result.response;
  return response.text();
}

