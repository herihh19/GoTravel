// upload.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { GoogleGenAI, createUserContent, createPartFromUri } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Configura onde os arquivos enviados serão salvos
const upload = multer({ dest: "uploads/" });

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

// Rota POST para upload da imagem
router.post("", upload.single("imagem"), async (req, res) => {
  try {
    const filePath = path.resolve(req.file.path);

    const myfile = await ai.files.upload({
      file: filePath,
      config: { mimeType: req.file.mimetype },
    });

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash", // ou "gemini-pro-vision", se disponível
      contents: createUserContent([
        createPartFromUri(myfile.uri, myfile.mimeType),
        "Descreva o conteúdo desta imagem.",
      ]),
    });

    fs.unlinkSync(filePath); // Remove o arquivo do servidor após o uso

    res.json({ legenda: response.text() });

  } catch (error) {
    console.error("Erro ao interpretar imagem:", error);
    res.status(500).json({ erro: "Erro ao processar a imagem." });
  }
});

export default router;
