/**
 * Módulo de Utilidades
 * 
 * Este módulo contém funções utilitárias usadas em toda a aplicação.
 */


export function blobToBase64(blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.readAsDataURL(blob);
  });
}