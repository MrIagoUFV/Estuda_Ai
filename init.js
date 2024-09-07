/**
 * Módulo de Inicialização
 * 
 * Este módulo é responsável por inicializar os event listeners da aplicação.
 * Ele configura os handlers para os inputs de imagem e botões da interface.
 */

import { handleImageInput, handleClipboardImage } from './image_handlers.js';
import { resetarPagina } from './ui_handlers.js';
import { DOM_IDS } from './constants.js';

export function initializeEventListeners() {
  document.getElementById(DOM_IDS.FILE_INPUT).addEventListener('change', (event) => {
    handleImageInput(event.target.files[0]);
  });

  document.getElementById(DOM_IDS.CAMERA_INPUT).addEventListener('change', (event) => {
    handleImageInput(event.target.files[0]);
  });

  document.getElementById(DOM_IDS.CLIPBOARD_BUTTON).addEventListener('click', handleClipboardImage);

  document.getElementById(DOM_IDS.OUTRA_QUESTAO_BUTTON).addEventListener('click', resetarPagina);

  // Adiciona a função resetarPagina ao escopo global para ser acessível pelo botão de erro
  window.resetarPagina = resetarPagina;
}