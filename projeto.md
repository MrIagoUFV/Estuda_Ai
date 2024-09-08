
# BLUEPRINT

- Logo: Emoji de um robô | Título: "Ajuda Ai" centralizado no header

em uma caixa os botões:

- Tirar foto
- Enviar foto
- Enviar print (do clipboard)
- Outra Questão (Inicialmente oculto)

em outra caixa as respostas:

- Acordeon: Links
    - Exibir um texto em markdown
- Acordeon: Aula Completa
    - Exibir um texto em markdown


Arquivos:

- index.html \\ Estrutura básica da página
- style.css \\ Estilos da página
- script.js \\ Lógica da página
- api.js \\ Scripts para comunicar com a API do Gemini

Importações:
- biblioteca para formatar o texto em markdown: marked.js
- api do google gemini
- biblioteca para ícones bonitos nos botões: font awesome
- biblioteca para criar o acordeon: accordion-js

Funções:
- Função para botão Tirar foto
- Função para botão Enviar foto
- Função para botão Enviar print (do clipboard)
Esses 3 botões recebem uma foto e enviam para a função Processar Foto:
- Função Processar foto: 
	- envia a foto pra função que chama a Função Gemini, e espera a resposta, 
	- se der certo, chama a função Exibir Resultados com o return do gemini, 
	- se der erro, exibe a mensagem de erro
- Função Exibir Resultados:
	- Recebe o objeto que contém os dois resultados, e atualiza o conteúdo dos dois acordeons exibindo as respostas nos acordeons correspondentes usando a biblioteca para formatar o markdown.
- Função Gemini: envia duas solicitações, com a mesma imagem, e retorna o objeto com as duas respostas separadas.


Além disso:
- Adiciona event listeners aos botões.
- Inicializa oS acordeões.
- Implementa a funcionalidade do botão "Outra Questão": A função do botão Outra Questão para ter a função de f5, ou seja, forçar recarregar a página, e além disso, limpar todos os cookies, cache e dados da página, para resetar do zero


Pontos de atenção:
1. Lembre-se de garantir que a Função Gemini seja global ou importada corretamente para que este código funcione.
2. Ajuste as permissões do navegador para acessar a câmera e a área de transferência.
3. Faça a importação necessária em cada arquivo, declare as variaveis locais e globais necessárias, importe corretamente a api do Gemini


Prompts:

const prompt1 = "1. Liste os tópicos que a questão aborda, com um termo de pesquisa para o Youtube. \n2. Liste um termo de pesquisa específico para um exercício resolvido similar. (Por exemplo, se usuário enviou uma foto e após analisá-la, você identificar que a questão é sobre MRU, retorne termos de pesquisa como \"exercício resolvido movimento retilíneo uniforme\")\n\nFormatação:\n- Use marcadores para listar os tópicos.\n- Para cada termo de pesquisa, crie um link direto para a busca no YouTube no formato: [Termo de Pesquisa](https://www.youtube.com/results?search_query=termo+de+pesquisa+formatado).\n- Utilize markdown para estruturar e formatar o texto, incluindo títulos, subtítulos e ênfases onde apropriado.\n\nExemplo de estrutura:\n\n## Tópicos Abordados\n- Tópico 1: [Termo de Pesquisa](link)\n- ...\n\n## Como encontrar exercícios resolvidos similares\n- Exercício resolvido de ... : [Termo de Pesquisa](link)\n- ...\n";

const prompt2 = "- Você vai ensinar uma aula completa sobre tudo o que precisa saber para resolver esse tipo de questão por conta própria. Toda a teoria por trás da questão, mas ainda sem entrar na explicação da questão. A aula deve ser dada usando o método Feynman, e deve ser o mais completa possível, explorando toda a teoria necessária para resolver a questão.\n- Ao final, adicione uma seção chamada \"CheatSheet: liste todas as Fórmulas e conceitos necessários ter em mente para resolver o exercício da foto.\n\nFormatação:\n- Use markdown extensivamente para estruturar o conteúdo, incluindo títulos, subtítulos, fórmulas, listas numeradas e com marcadores.\n- Destaque conceitos-chave, fórmulas e passos importantes usando negrito, itálico ou blocos de código quando apropriado.\n";


Documentação:

Importar o SDK e inicializar o modelo generativo
Antes de fazer chamadas de API, é necessário importar o SDK e inicializar o um modelo generativo. 

<html>
  <body>
    <!-- ... Your HTML and CSS -->

    <script type="importmap">
      {
        "imports": {
          "@google/generative-ai": "https://esm.run/@google/generative-ai"
        }
      }
    </script>
    <script type="module">
      import { GoogleGenerativeAI } from "@google/generative-ai";

      // Fetch your API_KEY
      const API_KEY = "...";
      // Reminder: This should only be for local testing

      // Access your API key (see "Set up your API key" above)
      const genAI = new GoogleGenerativeAI(API_KEY);

      // ...

      // The Gemini 1.5 models are versatile and work with most use cases
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

      // ...
    </script>
  </body>
</html>


Gerar texto com base em entradas de texto e imagem (multimodal)
O Gemini fornece vários modelos que podem processar entradas multimodais (modelos Gemini 1.5) para que você possa inserir texto e imagens. Não se esqueça de analisar requisitos de imagem para comandos.

Quando a entrada do comando incluir texto e imagens, use um modelo Gemini 1.5 com o método generateContent para gerar uma saída de texto:


import { GoogleGenerativeAI } from "@google/generative-ai";

// Access your API key (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(API_KEY);

// Converts a File object to a GoogleGenerativeAI.Part object.
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

async function run() {
  // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = "What's different between these pictures?";

  const fileInputEl = document.querySelector("input[type=file]");
  const imageParts = await Promise.all(
    [...fileInputEl.files].map(fileToGenerativePart)
  );

  const result = await model.generateContent([prompt, ...imageParts]);
  const response = await result.response;
  const text = response.text();
  console.log(text);
}

run();
