const chat = document.querySelector('#chat');
const input = document.querySelector('#input');
const botaoEnviar = document.querySelector('#botao-enviar');
const botaoMais = document.querySelector('#botao-mais');
const inputImagem = document.querySelector('#input-imagem');
const botaoLimpar = document.querySelector('#botao-limpar-conversa');

botaoEnviar.addEventListener('click', enviarMensagem);
botaoMais.addEventListener('click', () => inputImagem.click());
inputImagem.addEventListener('change', enviarImagem);
botaoLimpar.addEventListener('click', limparConversa);

input.addEventListener('keyup', function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        botaoEnviar.click();
    }
});

document.addEventListener('DOMContentLoaded', vaiParaFinalDoChat);

async function enviarMensagem() {
    if (input.value == '' || input.value == null) return;

    const mensagem = input.value;
    input.value = '';

    try {
        const response = await fetch('http://localhost:3000/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 'mensagem': mensagem })
        });

        const novaBolha = criaBolhaUsuario();
        novaBolha.innerHTML = mensagem;
        chat.appendChild(novaBolha);

        let novaBolhaBot = criaBolhaBot();
        chat.appendChild(novaBolhaBot);
        vaiParaFinalDoChat();

        const resposta = await response.json();
        novaBolhaBot.innerHTML = resposta.response;
        vaiParaFinalDoChat();

    } catch (error) {
        alert(error);
    }
}

function enviarImagem(event) {
    const arquivo = event.target.files[0];
    if (!arquivo) return;

    const reader = new FileReader();

    reader.onload = async function(e) {
        const base64 = e.target.result;

        const novaBolha = criaBolhaUsuario();
        novaBolha.innerHTML = `📎 Imagem: ${arquivo.name}`;
        chat.appendChild(novaBolha);

        const novaBolhaBot = criaBolhaBot();
        chat.appendChild(novaBolhaBot);
        vaiParaFinalDoChat();

        try {
            const response = await fetch('http://localhost:3000/analisar-imagem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ imagemBase64: base64 })
            });

            const resposta = await response.json();
            novaBolhaBot.innerHTML = resposta.response;
            vaiParaFinalDoChat();

        } catch (error) {
            novaBolhaBot.innerHTML = 'Erro ao analisar imagem.';
        }
    };

    reader.readAsDataURL(arquivo);
}

function criaBolhaUsuario() {
    const bolha = document.createElement('p');
    bolha.classList = 'chat__bolha chat__bolha--usuario';
    return bolha;
}

function criaBolhaBot() {
    let bolha = document.createElement('p');
    bolha.classList = 'chat__bolha chat__bolha--bot';
    bolha.innerHTML = '<div class="loader"></div>';
    return bolha;
}

function vaiParaFinalDoChat() {
    chat.scrollTop = chat.scrollHeight;
}

function limparConversa() {
    location.reload();
}
