/**
 * Módulo de Manipulação de Imagens
 * 
 * Este módulo contém funções para lidar com o input de imagens,
 * seja por upload de arquivo, câmera ou clipboard.
 */

import { analisarImagem } from './scripts_api.js';
import { preencherSecoes, mostrarErro } from './ui_handlers.js';
import { DOM_IDS } from './constants.js';

export async function handleImageInput(file) {
  if (file) {
    document.getElementById(DOM_IDS.LOADING).style.display = 'block';
    document.getElementById(DOM_IDS.RESULT).style.display = 'none';
    document.getElementById(DOM_IDS.UPLOAD_CONTAINER).style.display = 'none';
    try {
      const respostas = await analisarImagem(file);
      preencherSecoes(respostas);
      document.getElementById(DOM_IDS.OUTRA_QUESTAO_BUTTON).style.display = 'block';
    } catch (error) {
      console.error('Erro ao analisar imagem:', error);
      mostrarErro(error);
    } finally {
      document.getElementById(DOM_IDS.LOADING).style.display = 'none';
      document.getElementById(DOM_IDS.RESULT).style.display = 'block';
    }
  }
}

export async function handleClipboardImage() {
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