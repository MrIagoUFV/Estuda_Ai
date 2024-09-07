API KEY GEMINI: AIzaSyBAxF9haxbPv3kZrPdd3ExBcs1WeTdVusk

- Sempre usar o modelo gemini-1.5-pro
- O código deve ser feito em html, css e javascript puro, sem usar frameworks como react, vue, angular, etc.

Criar um projeto de uma ia para ajudar estudantes a estudar através de questões:

- Envia a foto da questão para a IA, junto com uma descrição em texto da questão: "Insira aqui a resposta da questão ou qualquer outro texto que ajude na interpretação da questão (opcional)" (opcional)
- A IA deve analisar a questão da seguinte como descrito em # Prompt para IA analisar a imagem e retornar
- Exiba a resposta em markdown formatado.


# Prompt para IA analisar a imagem e retornar:
        """
        Analise a imagem e responda:
        
        Estou estudando para um vestibular por questões de provas anteriores e quero que me ajude a estudar e aprender a matéria de cada questão da seguinte maneira:

        1. Vou enviar a questão e o gabarito dela.
        2. Você interpretá-la, sabendo a responda.
        3. Você vai listar os tópicos que ela aborda, com o um termo de pesquisa para o Youtube. 
        4. Você vai listar um termo de pesquisa específico para um exercício resolvido similar. (Por exemplo, se usuário enviou uma foto e após analisá-la, você identificar que a questão é sobre MRU, retorne termos de pesquisa como "exercício resolvido movimento retilíneo uniforme")
        4. Você vai ensinar uma aula completa sobre tudo o que preciso saber para responder esse tipo de questão por conta própria. Toda a teoria por traz da questão, mas ainda sem entrar na explicação da questão. A aula deve ser dada usando o método Feynman, e deve ser o mais completa possível, explorando toda a teoria necessária para responder a questão. Os termos de pesquisa acima, vão ser caso eu não entenda a sua explicação, eu saber como procurar no Youtube.
        5. Você vai explicar o passo a passo para resolver questões desse tipo (ainda sem resolver a questão, devem ser etapas gerais, como um framework, que funcione para qualquer exercício similar)
        6. Retorne tudo em um texto, bem formatado, com tópicos, subtópicos, explicações, etc. em markdown.
        """


adapte o prompt sugerido pelo proprio gemin para funcionar com qualquer imagem (o código abaixo é para node, adaptá-lo para html como o modelo já disposto no index.html):

/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 */

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

/**
 * Uploads the given file to Gemini.
 *
 * See https://ai.google.dev/gemini-api/docs/prompting_with_media
 */
async function uploadToGemini(path, mimeType) {
  const uploadResult = await fileManager.uploadFile(path, {
    mimeType,
    displayName: path,
  });
  const file = uploadResult.file;
  console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
  return file;
}

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function run() {
  // TODO Make these files available on the local file system
  // You may need to update the file paths
  const files = [
    await uploadToGemini("unnamed.png", "image/png"),
  ];

  const chatSession = model.startChat({
    generationConfig,
 // safetySettings: Adjust safety settings
 // See https://ai.google.dev/gemini-api/docs/safety-settings
    history: [
      {
        role: "user",
        parts: [
          {
            fileData: {
              mimeType: files[0].mimeType,
              fileUri: files[0].uri,
            },
          },
          {text: "Analise a imagem e responda:\n\n\n        Estou estudando para um vestibular por questões de provas anteriores e quero que me ajude a estudar e aprender a matéria de cada questão da seguinte maneira:\n\n        1. Vou enviar a questão e o gabarito dela.\n        2. Você interpretá-la, sabendo a responda.\n        3. Você vai listar os tópicos que ela aborda, com o um termo de pesquisa para o Youtube. \n        4. Você vai listar um termo de pesquisa específico para um exercício resolvido similar. (Por exemplo, se usuário enviou uma foto e após analisá-la, você identificar que a questão é sobre MRU, retorne termos de pesquisa como \"exercício resolvido movimento retilíneo uniforme\")\n        4. Você vai ensinar uma aula completa sobre tudo o que preciso saber para responder esse tipo de questão por conta própria. Toda a teoria por traz da questão, mas ainda sem entrar na explicação da questão. A aula deve ser dada usando o método Feynman, e deve ser o mais completa possível, explorando toda a teoria necessária para responder a questão. Os termos de pesquisa acima, vão ser caso eu não entenda a sua explicação, eu saber como procurar no Youtube.\n        5. Você vai explicar o passo a passo para resolver questões desse tipo (ainda sem resolver a questão, devem ser etapas gerais, como um framework, que funcione para qualquer exercício similar)\n        6. Retorne tudo em um texto, bem formatado, com tópicos, subtópicos, explicações, etc. em markdown."},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "## Desvendando a Geometria de Quadras Esportivas: Uma Jornada Completa\n\n## Entendendo o Problema\n\n**Questão:** Uma quadra esportiva tem o formato de um retângulo. Sabemos que o perímetro dessa quadra mede 86m e que um lado supera o outro em 11m. O piso dessa quadra será revestido por um de borracha. Assinale a alternativa que indica, CORRETAMENTE, quantos m² desse piso serão gastos:\n\na) 432\nb) 729\nc) 256\n**d) 473**\n\n**Gabarito:** d) 473\n\n**Tópicos Abordados:**\n\n* **Geometria Plana:**  [Pesquisar no Youtube: \"Geometria plana\"](https://www.youtube.com/results?search_query=Geometria+plana)\n* **Retângulos:** [Pesquisar no Youtube: \"Retângulos\"](https://www.youtube.com/results?search_query=Retângulos)\n* **Perímetro:** [Pesquisar no Youtube: \"Perímetro de retângulos\"](https://www.youtube.com/results?search_query=Perímetro+de+retângulos)\n* **Área:** [Pesquisar no Youtube: \"Área de retângulos\"](https://www.youtube.com/results?search_query=Área+de+retângulos)\n* **Sistemas de Equações:** [Pesquisar no Youtube: \"Sistemas de equações do 1º grau\"](https://www.youtube.com/results?search_query=Sistemas+de+equações+do+1º+grau)\n\n\n**Exercício Similar:** [Pesquisar no Youtube: \"Exercício resolvido área e perímetro de retângulos\"](https://www.youtube.com/results?search_query=Exercício+resolvido+área+e+perímetro+de+retângulos)\n\n## Aula Completa sobre Áreas e Perímetros de Retângulos (Método Feynman)\n\nImagina que você quer construir uma quadra esportiva retangular no seu quintal. Para isso, você precisa saber quanta tela comprar para cercar a quadra e quanto de grama comprar para cobrir o chão. É aí que entram o **perímetro** e a **área**.\n\n### O que é um Retângulo?\n\nVamos começar do básico. Um **retângulo** é uma figura geométrica plana com quatro lados e quatro ângulos retos (90 graus).\n\n* **Lados Opostos Congruentes:** Os lados opostos de um retângulo têm o mesmo comprimento.\n* **Ângulos Retos:** Todos os ângulos internos de um retângulo são ângulos retos.\n\n### Perímetro: Contornando a Quadra\n\nImagine que você quer colocar uma cerca ao redor da sua quadra. O **perímetro** é a medida total da linha que forma o contorno de uma figura. No caso do retângulo, é a soma dos comprimentos de todos os seus lados.\n\nSe chamarmos o comprimento do retângulo de \"c\" e a largura de \"l\", podemos calcular o perímetro (P) da seguinte forma:\n\n**Fórmula do Perímetro do Retângulo:** P = 2c + 2l\n\n### Área: Cobrindo o Chão da Quadra\n\nAgora, vamos cobrir o chão da quadra com grama. A **área** de uma figura plana é a medida da superfície que ela ocupa. Para o retângulo, a área é calculada multiplicando o comprimento pela largura.\n\n**Fórmula da Área do Retângulo:** A = c * l\n\n### Resolvendo Problemas com Perímetro e Área\n\nEm muitos problemas, você terá informações sobre o perímetro e/ou a área e precisará encontrar os lados do retângulo. É aí que entram as equações.\n\n1. **Identifique as informações dadas:** O problema fornece o perímetro, a área ou os lados do retângulo?\n2. **Escreva as fórmulas:** Anote as fórmulas do perímetro e/ou da área do retângulo.\n3. **Substitua os valores conhecidos:** Substitua as informações dadas nas fórmulas.\n4. **Resolva as equações:** Use álgebra para isolar as variáveis desconhecidas (comprimento e largura).\n5. **Verifique sua resposta:** Certifique-se de que suas respostas façam sentido no contexto do problema.\n\n## Guia Passo a Passo para Resolver Questões Similares\n\n1. **Compreenda o problema:** Leia atentamente o enunciado e identifique as informações fornecidas (perímetro, diferença entre os lados) e o que se pede (área).\n2. **Defina variáveis:**  Atribua variáveis aos valores desconhecidos. Por exemplo:\n    *  Comprimento do retângulo: **c**\n    *  Largura do retângulo: **l**\n3. **Monte um sistema de equações:** Traduza as informações do problema em equações matemáticas:\n    *  Perímetro: 2c + 2l = 86\n    *  Diferença entre os lados: c = l + 11 \n4. **Resolva o sistema de equações:** Encontre os valores de \"c\" e \"l\" que satisfazem amba"},
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
  console.log(result.response.text());
}

run();
