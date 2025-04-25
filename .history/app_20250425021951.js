import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { executaChat } from './chat.js';
import { inicializaChat } from './inicializaChat.js';
import uploadRouter from "./upload.js";
app.use(uploadRouter);

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

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


document.getElementById("botao-anexar-imagem").addEventListener("click", () => {
  document.getElementById("input-imagem").click();
});

document.getElementById("input-imagem").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("imagem", file);

  adicionarMensagem("Enviando imagem para análise...", "usuario");

  const resposta = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const dados = await resposta.json();

  if (dados.legenda) {
    adicionarMensagem(dados.legenda, "bot");
  } else {
    adicionarMensagem("Erro ao interpretar a imagem.", "bot");
  }
});

function adicionarMensagem(mensagem, autor = "bot") {
  const chat = document.getElementById("chat");
  const bolha = document.createElement("p");
  bolha.className = `chat__bolha chat__bolha--${autor}`;
  bolha.innerHTML = mensagem;
  chat.appendChild(bolha);
  chat.scrollTop = chat.scrollHeight;
}
