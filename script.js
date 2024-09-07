import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

const API_KEY = "AIzaSyBAxF9haxbPv3kZrPdd3ExBcs1WeTdVusk";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
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

/**
 * Analisa a imagem usando o modelo Gemini.
 * @param {File} imageFile - O arquivo de imagem a ser analisado.
 * @returns {Promise<string[]>} Um array com as respostas para cada prompt.
 */
async function analisarImagem(imageFile) {
    const imageData = await blobToBase64(imageFile);
    const imagePart = {
        inlineData: {
            mimeType: imageFile.type,
            data: imageData
        }
    };

    return await Promise.all(prompts.map(async (prompt) => {
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [imagePart, prompt] }],
            generationConfig,
        });
        return result.response.text();
    }));
}

/**
 * Converte um Blob para Base64.
 * @param {Blob} blob - O Blob a ser convertido.
 * @returns {Promise<string>} A string Base64 resultante.
 */
function blobToBase64(blob) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(blob);
    });
}

/**
 * Manipula a entrada de imagem, analisando-a e exibindo os resultados.
 * @param {File} file - O arquivo de imagem a ser processado.
 */
async function handleImageInput(file) {
    if (!file) return;

    const loadingEl = document.getElementById('loading');
    const resultEl = document.getElementById('result');

    loadingEl.style.display = 'block';
    resultEl.style.display = 'none';

    try {
        const respostas = await analisarImagem(file);
        preencherSecoes(respostas);
    } catch (error) {
        console.error('Erro ao analisar imagem:', error);
        resultEl.textContent = 'Ocorreu um erro ao analisar a imagem. Por favor, tente novamente.';
    } finally {
        loadingEl.style.display = 'none';
        resultEl.style.display = 'block';
    }
}

/**
 * Preenche as seções do resultado com as respostas analisadas.
 * @param {string[]} respostas - As respostas analisadas para cada seção.
 */
function preencherSecoes(respostas) {
    const ids = ['introducao', 'interpretacao', 'aula'];
    
    respostas.forEach((resposta, index) => {
        const elemento = document.querySelector(`#${ids[index]} .content`);
        elemento.innerHTML = marked.parse(resposta);
    });

    document.querySelectorAll('.section h2').forEach(header => {
        header.addEventListener('click', () => {
            header.parentElement.classList.toggle('expanded');
        });
    });
}

/**
 * Manipula a imagem do clipboard.
 */
async function handleClipboardImage() {
    try {
        const clipboardItems = await navigator.clipboard.read();
        for (const clipboardItem of clipboardItems) {
            for (const type of clipboardItem.types) {
                if (type.startsWith('image/')) {
                    const blob = await clipboardItem.getType(type);
                    handleImageInput(new File([blob], "clipboard-image.png", { type: blob.type }));
                    return;
                }
            }
        }
        alert('Nenhuma imagem encontrada no clipboard. Por favor, tire um print e tente novamente.');
    } catch (err) {
        console.error('Erro ao acessar o clipboard:', err);
        alert('Não foi possível acessar o clipboard. Verifique se você deu permissão para o site acessar o clipboard.');
    }
}

// Adiciona os event listeners
document.getElementById('file-input').addEventListener('change', (event) => handleImageInput(event.target.files[0]));
document.getElementById('camera-input').addEventListener('change', (event) => handleImageInput(event.target.files[0]));
document.getElementById('clipboard-button').addEventListener('click', handleClipboardImage);

// Adicione este código no início do seu arquivo script.js

document.addEventListener('DOMContentLoaded', () => {
    const accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        header.addEventListener('click', () => {
            item.classList.toggle('active');
        });
    });
});