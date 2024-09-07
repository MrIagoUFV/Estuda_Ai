import { analisarImagem } from './api.js';

let respostasMemoria = {
    introducao: '',
    interpretacao: '',
    aula: ''
};

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('file-input').addEventListener('change', (event) => {
        handleImageInput(event.target.files[0]);
    });

    document.getElementById('camera-input').addEventListener('change', (event) => {
        handleImageInput(event.target.files[0]);
    });

    document.getElementById('clipboard-button').addEventListener('click', handleClipboardImage);

    // Inicializar os event listeners do acordeão
    initializeAccordion();
});

function initializeAccordion() {
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', toggleAccordion);
    });
}

async function handleImageInput(file) {
    if (file) {
        // Limpar a memória e as divs antes de enviar a nova solicitação
        limparMemoriaEDivs();
        
        document.getElementById('loading').style.display = 'block';
        document.getElementById('result').style.display = 'none';
        
        try {
            const respostas = await analisarImagem(file);
            salvarRespostasNaMemoria(respostas);
            preencherSecoes();
        } catch (error) {
            console.error('Erro ao analisar imagem:', error);
            document.getElementById('result').textContent = 'Ocorreu um erro ao analisar a imagem. Por favor, tente novamente.';
        } finally {
            document.getElementById('loading').style.display = 'none';
            document.getElementById('result').style.display = 'block';
        }
    }
}

function limparMemoriaEDivs() {
    respostasMemoria = {
        introducao: '',
        interpretacao: '',
        aula: ''
    };

    document.querySelectorAll('.accordion-content').forEach(content => {
        content.innerHTML = '';
        content.style.maxHeight = null;
    });

    document.querySelectorAll('.accordion-item').forEach(item => {
        item.classList.remove('active');
    });
}

function salvarRespostasNaMemoria(respostas) {
    const keys = ['introducao', 'interpretacao', 'aula'];
    respostas.forEach((resposta, index) => {
        respostasMemoria[keys[index]] = resposta;
    });
}

function preencherSecoes() {
    Object.entries(respostasMemoria).forEach(([key, value]) => {
        const elemento = document.getElementById(key);
        if (elemento) {
            elemento.innerHTML = marked.parse(value);
        }
    });

    // Abrir a primeira seção por padrão
    const firstAccordionItem = document.querySelector('.accordion-item');
    if (firstAccordionItem) {
        firstAccordionItem.classList.add('active');
        const content = firstAccordionItem.querySelector('.accordion-content');
        if (content) {
            content.style.maxHeight = content.scrollHeight + 'px';
        }
    }
}

function toggleAccordion() {
    const item = this.parentElement;
    const content = item.querySelector('.accordion-content');
    
    document.querySelectorAll('.accordion-item').forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
            otherItem.querySelector('.accordion-content').style.maxHeight = null;
        }
    });

    if (item.classList.contains('active')) {
        item.classList.remove('active');
        content.style.maxHeight = null;
    } else {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
    }
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