import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { executaChat } from './chat.js';
import { inicializaChat } from './inicializaChat.js';
import uploadRouter from './upload.js'; // importa a rota de upload
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express(); // ✅ agora pode usar "app" depois disso
const port = process.env.PORT || 3000;

app.use(express.json());

// Static files
app.use('/static', express.static(join(__dirname, 'static'), { extensions: ['css', 'svg', 'js'] }));

// 🧩 Adiciona a rota de upload
app.use(uploadRouter);

// Página inicial
app.get('/', (req, res) => {
  inicializaChat();
  res.sendFile(join(__dirname, 'templates', 'chat.html'));
});

// Chat principal (texto)
app.post('/chat', async (req, res) => {
  try {
    const mensagem = req.body?.mensagem;
    console.log('Mensagem do usuário', mensagem);

    if (!mensagem) {
      return res.status(400).json({ error: 'Erro no corpo da requisição' });
    }

    const response =
