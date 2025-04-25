export async function enviarImagem(imagem) {
    const prompt = "Me fale tudo que puder sobre o destino mostrado nessa imagem";
    const imageParts = [
        fileToGenerativePart(imagem, "image/png"),
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();
    return text;
}
