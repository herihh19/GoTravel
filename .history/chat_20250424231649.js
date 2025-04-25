import {chat} from './inicializaChat.js';
export async function executaChat(mensagem) {
  const result = await chat.sendMessage(mensagem);
  const response = await result.response;
  return response.text();
}

