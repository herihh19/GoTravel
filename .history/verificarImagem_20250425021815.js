import express from "express";
import multer from "multer";
import path from "path";
import { GoogleGenAI, createUserContent, createPartFromUri } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const router = express.Router();

const upload = multer({ dest: "uploads/" });

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

router.post("/api/upload", upload.single("imagem"), async (req, res) => {
  try {
    const filePath = path.resolve(req.file.path);

    const myfile = await ai.files.upload({
      file: filePath,
      config: { mimeType: req.file.mimetype },
    });

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: createUserContent([
        createPartFromUri(myfile.uri, myfile.mimeType),
        "Caption this image.",
      ]),
    });

    fs.unlinkSync(filePath); // Limpa o arquivo local após uso
    res.json({ legenda: response.text() });

  } catch (error) {
    console.error("Erro ao interpretar imagem:", error);
    res.status(500).json({ erro: "Erro ao processar a imagem." });
  }
});

export default router;
