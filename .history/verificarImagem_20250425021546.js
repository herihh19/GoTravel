import {
    GoogleGenAI,
    createUserContent,
    createPartFromUri,
  } from "@google/genai";
  import dotenv from 'dotenv';
  dotenv.config();
  const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
  
  async function main() {
    const myfile = await ai.files.upload({
      file: "path/to/sample.jpg",
      config: { mimeType: "image/jpeg" },
    });
  
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: createUserContent([
        createPartFromUri(myfile.uri, myfile.mimeType),
        "Caption this image.",
      ]),
    });
    console.log(response.text);
  }
  
  await main();