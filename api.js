import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyBAxF9haxbPv3kZrPdd3ExBcs1WeTdVusk";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export async function analisarImagem(imageFile) {
  try {
    const imageData = await blobToBase64(imageFile);
    const imagePart = {
      inlineData: {
        mimeType: imageFile.type,
        data: imageData
      }
    };

    const prompts = [
      {
        text: `Analise a imagem e responda:

        1. Liste os tópicos que ela aborda, com um termo de pesquisa para o YouTube.
        2. Forneça termos de pesquisa específicos para exercícios resolvidos similares.

        Para os tópicos abordados e termos de pesquisa, forneça-os no formato de links do YouTube, por exemplo: [Termo de Pesquisa](https://www.youtube.com/results?search_query=termo+de+pesquisa).

        Use markdown para formatar o texto.`
      },
      {
        text: `Analise a imagem e responda:

        Interprete a questão sem respondê-la (como um aluno exemplar lendo a questão, entendendo o que ela pede, e separando tudo de importante para respondê-la com excelência).

        Use markdown para formatar o texto.`
      },
      {
        text: `Analise a imagem e responda:

        1. Ensine uma aula completa sobre tudo o que é necessário saber para responder esse tipo de questão por conta própria. Explore toda a teoria por trás da questão, mas sem entrar na explicação específica da questão. Use o método Feynman para explicar os conceitos.

        2. Explique o passo a passo geral para resolver questões desse tipo (sem resolver a questão específica, forneça etapas gerais que funcionem para qualquer exercício similar).

        Use markdown para formatar o texto.`
      }
    ];

    const respostas = await Promise.all(prompts.map(async (prompt) => {
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [imagePart, prompt] }],
        generationConfig,
      });
      return result.response.text();
    }));

    return respostas;
  } catch (error) {
    console.error('Erro ao analisar imagem:', error);
    throw error; // Propaga o erro para ser tratado em handleImageInput
  }
}

function blobToBase64(blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.readAsDataURL(blob);
  });
}