import { GoogleGenAI, createUserContent, createPartFromUri } from "@google/genai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

async function main() {
  // Caminho do arquivo (ajustado para funcionar com ES Modules)
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const imagePath = path.join(__dirname, "assets", "sample.jpg");

  const myfile = await ai.files.upload({
    file: imagePath,
    config: { mimeType: "image/jpeg" },
  });

  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash", // Use o modelo mais atual, se disponível
    contents: createUserContent([
      createPartFromUri(myfile.uri, myfile.mimeType),
      "Caption this image.",
    ]),
  });

  console.log(response.text());
}

main().catch(console.error);
