/**
 * Módulo de Prompts
 * 
 * Este módulo contém os prompts utilizados para gerar as respostas
 * da API do Google Generative AI.
 */

export const promptIntroducao = `
Analise detalhadamente a imagem da questão do exercício fornecida e responda:

1. Forneça uma introdução bem concisa e informativa sobre a questão.
2. Liste tópicos abordados na questão.
3. Para cada tópico, forneça um termo de pesquisa específico para o YouTube, visando vídeo-aulas sobre o assunto.
4. Forneça termos de pesquisa para encontrar exercícios resolvidos similares no YouTube.

Formatação:
- Use marcadores para listar os tópicos.
- Para cada termo de pesquisa, crie um link direto para a busca no YouTube no formato: [Termo de Pesquisa](https://www.youtube.com/results?search_query=termo+de+pesquisa+formatado).
- Utilize markdown para estruturar e formatar o texto, incluindo títulos, subtítulos e ênfases onde apropriado.

Exemplo de estrutura:

## Questão de ...

Esse exercício é sobre ... (seja bem específico)

## Tópicos Abordados
- Tópico 1: [Termo de Pesquisa](link)
- ...

## Como encontrar exercícios resolvidos similares
- Exercício resolvido de ... : [Termo de Pesquisa](link)
- ...
`;

export const promptAulaCompleta = `
Com base na questão fornecida, elabore uma aula completa e detalhada, ensinando todo o conteúdo necessário saber antes de resolver o exercício, seguindo estas diretrizes:

- Não cite a questão, apenas o conteúdo necessário para resolver o exercício.
- Use markdown extensivamente para estruturar o conteúdo, incluindo títulos, subtítulos, fórmulas, listas numeradas e com marcadores.
- Destaque conceitos-chave, fórmulas e passos importantes usando negrito, itálico ou blocos de código quando apropriado.
- Inclua exemplos práticos quando possível.
- Busque explicar da forma mais clara e didática possível, como se fosse explicar para um aluno do ensino médio.
`;

export const promptMetodologia = `
Desenvolva um framework geral para explicar o passo a passo de como resolver essa questão.

   - CheatSheet: Fórmulas e conceitos necessários.	
   - Passo 1: ...
   - Passo 2: ...
   - ... continue até explicar todos os passos necessários para resolver o exercício.

   Regras:
   - Não cite a questão, apenas os passos gerais necessários para resolver esse tipo de exercício.
   - Não resolva a questão, apenas forneça o passo a passo.

Formatação:
- Use markdown extensivamente para estruturar o conteúdo, incluindo títulos, subtítulos, listas numeradas e com marcadores.
- Destaque conceitos-chave, fórmulas e passos importantes usando negrito, itálico ou blocos de código quando apropriado.
`;