import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyAEv2Oh_S_x4E7xRioeBU3eMiG8oX03z20";
const genAI = new GoogleGenerativeAI(API_KEY);

async function fileToGenerativePart(file) {
  const base64EncodedDataPromise = new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
}

export async function Gemini(imageFile) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  const imagePart = await fileToGenerativePart(imageFile);

  const prompt1 = "1. Liste os tópicos que a questão aborda, com um termo de pesquisa para o Youtube. \n2. Liste um termo de pesquisa específico para um exercício resolvido similar. (Por exemplo, se usuário enviou uma foto e após analisá-la, você identificar que a questão é sobre MRU, retorne termos de pesquisa como \"exercício resolvido movimento retilíneo uniforme\")\n\nFormatação:\n- Use marcadores para listar os tópicos.\n- Para cada termo de pesquisa, crie um link direto para a busca no YouTube no formato: [Termo de Pesquisa](https://www.youtube.com/results?search_query=termo+de+pesquisa+formatado).\n- Utilize markdown para estruturar e formatar o texto, incluindo títulos, subtítulos e ênfases onde apropriado.\n\nExemplo de estrutura:\n\n## Tópicos Abordados\n- Tópico 1: [Termo de Pesquisa](link)\n- ...\n\n## Como encontrar exercícios resolvidos similares\n- Exercício resolvido de ... : [Termo de Pesquisa](link)\n- ...\n";

  const prompt2 = "- Você vai ensinar uma aula completa sobre tudo o que precisa saber para resolver esse tipo de questão por conta própria. Toda a teoria por trás da questão, mas ainda sem entrar na explicação da questão. A aula deve ser dada usando o método Feynman, e deve ser o mais completa possível, explorando toda a teoria necessária para resolver a questão.\n- Ao final, adicione uma seção chamada \"CheatSheet: liste todas as Fórmulas e conceitos necessários ter em mente para resolver o exercício da foto.\n\nFormatação:\n- Use markdown extensivamente para estruturar o conteúdo, incluindo títulos, subtítulos, fórmulas, listas numeradas e com marcadores.\n- Destaque conceitos-chave, fórmulas e passos importantes usando negrito, itálico ou blocos de código quando apropriado.\n";

  try {
    const result1 = await model.generateContent([prompt1, imagePart]);
    const result2 = await model.generateContent([prompt2, imagePart]);

    return {
      links: await result1.response.text(),
      aula: await result2.response.text()
    };
  } catch (error) {
    console.error("Erro ao processar a imagem:", error);
    throw error;
  }
}
