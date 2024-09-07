/**
 * Módulo de Integração com a API do Google Generative AI
 * 
 * Este módulo é responsável pela comunicação com a API do Google Generative AI
 * para análise de imagens e geração de conteúdo.
 */


import { GoogleGenerativeAI } from "@google/generative-ai";
import { promptIntroducao, promptAulaCompleta, promptMetodologia } from './prompts.js';

const API_KEY = "AIzaSyBAxF9haxbPv3kZrPdd3ExBcs1WeTdVusk";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 16384,
  responseMimeType: "text/plain",
};

export async function analisarImagem(imageFile) {
  const imageData = await blobToBase64(imageFile);
  const imagePart = {
    inlineData: {
      mimeType: imageFile.type,
      data: imageData
    }
  };

  const prompts = [
    { text: promptIntroducao },
    { text: promptAulaCompleta },
    { text: promptMetodologia }
  ];

  const respostas = await Promise.all(prompts.map(async (prompt) => {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [imagePart, prompt] }],
      generationConfig,
    });
    return result.response.text();
  }));

  return respostas;
}

function blobToBase64(blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.readAsDataURL(blob);
  });
}