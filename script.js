import { analisarImagem } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    // Coloque todo o código existente aqui
    
    document.getElementById('file-input').addEventListener('change', (event) => {
        handleImageInput(event.target.files[0]);
    });

    document.getElementById('camera-input').addEventListener('change', (event) => {
        handleImageInput(event.target.files[0]);
    });

    document.getElementById('clipboard-button').addEventListener('click', handleClipboardImage);
});

async function handleImageInput(file) {
    if (file) {
        document.getElementById('loading').style.display = 'block';
        document.getElementById('result').style.display = 'none';
        try {
            const respostas = await analisarImagem(file);
            preencherSecoes(respostas);
        } catch (error) {
            console.error('Erro ao analisar imagem:', error);
            document.getElementById('result').textContent = 'Ocorreu um erro ao analisar a imagem. Por favor, tente novamente.';
        } finally {
            document.getElementById('loading').style.display = 'none';
            document.getElementById('result').style.display = 'block';
        }
    }
}

function preencherSecoes(respostas) {
    const ids = ['introducao', 'interpretacao', 'aula'];
    
    respostas.forEach((resposta, index) => {
        const elemento = document.getElementById(ids[index]);
        if (elemento) {
            elemento.innerHTML = marked.parse(resposta);
        }
    });

    // Adicionar evento de clique para expandir/contrair
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            header.parentElement.classList.toggle('active');
        });
    });
}

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