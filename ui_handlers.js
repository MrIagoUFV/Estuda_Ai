/**
 * Módulo de Manipulação da Interface do Usuário
 * 
 * Este módulo contém funções para atualizar a interface do usuário,
 * incluindo preenchimento de seções, exibição de erros e reset da página.
 */

import { DOM_IDS } from './constants.js';

export function preencherSecoes(respostas) {
  const ids = [DOM_IDS.INTRODUCAO, DOM_IDS.INTERPRETACAO, DOM_IDS.AULA];
  
  respostas.forEach((resposta, index) => {
    const elemento = document.getElementById(ids[index]);
    if (elemento) {
      elemento.innerHTML = marked.parse(resposta);
    }
  });

  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const content = item.querySelector('.accordion-content');
      
      if (item.classList.contains('active')) {
        item.classList.remove('active');
        content.style.maxHeight = '0';
      } else {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}

export function mostrarErro(error) {
  let mensagemErro = 'Ocorreu um erro ao analisar a imagem. Por favor, tente novamente.';
  if (error.message) {
    mensagemErro += ' Detalhes do erro: ' + error.message;
  }
  document.getElementById(DOM_IDS.RESULT).innerHTML = `
    <div class="erro-container">
      <p>${mensagemErro}</p>
      <button onclick="resetarPagina()" class="tentar-novamente-button">Tentar Novamente</button>
    </div>
  `;
}

export function resetarPagina() {
  // Limpa todos os cookies
  document.cookie.split(";").forEach(function(c) { 
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
  });

  // Limpa o localStorage e sessionStorage
  localStorage.clear();
  sessionStorage.clear();

  // Força o recarregamento da página sem usar o cache
  window.location.reload(true);
}