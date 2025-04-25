import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { executaChat } from './chat.js';
import { inicializaChat } from './inicializaChat.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = ("gemini-1.5-flash");

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

app.post('/analisar-imagem', upload.single('imagem'), async (req, res) => {
  try {
    const caminhoImagem = req.file.path;

    const resposta = await processaImagem(caminhoImagem);
    res.json({ response: resposta });

  } catch (error) {
    console.error('Erro ao processar imagem:', error);
    res.status(500).json({ error: 'Erro ao analisar imagem.' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
