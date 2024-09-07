# Analisador de Questões de Vestibular

## Descrição
Este projeto é uma ferramenta de IA projetada para auxiliar estudantes na preparação para vestibulares. Utilizando a API do Google Gemini, a aplicação analisa imagens de questões de vestibular e fornece explicações detalhadas, facilitando o processo de estudo e compreensão.

## Funcionalidades
- Upload de imagens de questões de vestibular (arquivo, câmera ou clipboard)
- Análise automática da questão usando IA
- Geração de explicações detalhadas sobre os tópicos abordados
- Sugestões de termos de pesquisa para aprofundamento
- Aula completa sobre o tema da questão
- Guia passo a passo para resolver questões similares

## Tecnologias Utilizadas
- HTML5, CSS3, JavaScript (ES6+)
- Google Generative AI API
- Marked.js para renderização de Markdown

## Estrutura do Projeto
- `index.html`: Estrutura principal da página
- `styles.css`: Estilos da aplicação
- `init.js`: Inicialização de event listeners
- `image_handlers.js`: Manipulação de inputs de imagem
- `ui_handlers.js`: Manipulação da interface do usuário
- `scripts_api.js`: Integração com a API do Google
- `prompts.js`: Prompts para a geração de conteúdo
- `constants.js`: Constantes utilizadas na aplicação
- `utils.js`: Funções utilitárias

## Como Usar
1. Abra `index.html` em um navegador web moderno
2. Escolha uma opção para enviar a imagem da questão:
   - "Escolher imagem" para selecionar um arquivo
   - "Tirar foto" para usar a câmera (dispositivos móveis)
   - "Enviar Print" para colar uma imagem do clipboard (desktop)
3. Aguarde a análise da IA
4. Explore as explicações fornecidas nas seções do acordeão

## Configuração e Instalação
1. Clone o repositório
2. Substitua a `API_KEY` em `scripts_api.js` pela sua chave da API do Google Gemini, se necessário
3. Abra `index.html` em um servidor web local ou hospede os arquivos em um servidor

## Contribuições
Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests com melhorias.

## Licença
Este projeto é distribuído sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## Link do Projeto
[https://mriago.me/Estuda_Ai/](https://mriago.me/Estuda_Ai/)

## Capturas de Tela
![Captura de tela da aplicação](https://github.com/user-attachments/assets/23d64e5c-c0de-42cf-8dd2-ac161e550285)

## Ícone do Projeto
![Ícone do projeto](https://github.com/user-attachments/assets/b4d67ee8-e892-4eaf-a1f9-e7149b6aad8f)