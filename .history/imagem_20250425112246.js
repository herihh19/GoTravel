function enviarImagem(event) {
    const arquivo = event.target.files[0];
    if (!arquivo) return;
  
    const novaBolha = criaBolhaUsuario();
    novaBolha.innerHTML = `Imagem: ${arquivo.name}`;
    chat.appendChild(novaBolha);
  
    const novaBolhaBot = criaBolhaBot();
    chat.appendChild(novaBolhaBot);
    vaiParaFinalDoChat();
  
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result;
  
      try {
        const response = await fetch('http://localhost:3000/analisar-imagem', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imagemBase64: base64 })
        });
  
        const data = await response.json();
        novaBolhaBot.innerHTML = data.response;
      } catch (error) {
        novaBolhaBot.innerHTML = 'Erro ao analisar imagem.';
        console.error(error);
      }
  
      vaiParaFinalDoChat();
    };
  
    reader.readAsDataURL(arquivo);
  }
  