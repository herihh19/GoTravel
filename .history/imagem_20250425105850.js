app.post('/analisar-imagem', async (req, res) => {
    const { imagemBase64 } = req.body;

    try {
        const resposta = await gemini.chat({
            contents: [{
                parts: [
                    { inlineData: { mimeType: "image/png", data: imagemBase64.split(',')[1] } },
                    { text: "Descreva a imagem." }
                ]
            }]
        });

        res.json({ response: resposta.text() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ response: 'Erro na análise da imagem.' });
    }
});
