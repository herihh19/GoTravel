import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { executaChat } from './chat.js';
import { inicializaChat } from './inicializaChat.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model =("gemini-1.5-flash");

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/static', express.static(join(__dirname, 'static'), { extensions: ['css', 'svg', 'js'] }));

app.get('/', (req, res) => {
  inicializaChat();
  res.sendFile(join(__dirname, 'templates', 'chat.html'));
});

app.post('/chat', async (req, res) => {
  try {
    const mensagem = req.body?.mensagem;
    console.log('Mensagem do usuário', mensagem)

    if (!mensagem) {
      return res.status(400).json({ error: 'Erro no corpo da requisição' });
    }
    const response = await executaChat(mensagem);
    res.json({ response });

  } catch (error) {
    console.error('Error no endpoint do chat:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.post('/analisar-imagem', async (req, res) => {
  try {
    const { imagemBase64 } = req.body;

    if (!imagemBase64) {
      return res.status(400).json({ response: 'Imagem não fornecida.' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: 'image/png', // ou 'image/png' conforme o tipo
          data: imagemBase64.split(',')[1] // remove o prefixo "data:image/jpeg;base64,"
        }
      },
      { text: 'Descreva a imagem.' }
    ]);

    const response = await result.response;
    const text = await response.text();

    res.json({ response: text });

  } catch (error) {
    console.error('Erro ao analisar imagem:', error);
    res.status(500).json({ response: 'Erro ao analisar imagem.' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
