import { Gemini } from './api.js';

// Inicializar o acordeão quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new Accordion('.accordion-container');
});


// Função para enviar foto
function enviarFoto() {
    const input = document.getElementById('fileInput');
    input.click();
    input.onchange = () => {
        if (input.files.length > 0) {
            processarFoto(input.files[0]);
        }
    };
}

// Função para enviar print do clipboard
async function enviarPrint() {
    try {
        const clipboardItems = await navigator.clipboard.read();
        for (const clipboardItem of clipboardItems) {
            for (const type of clipboardItem.types) {
                if (type.startsWith('image/')) {
                    const blob = await clipboardItem.getType(type);
                    processarFoto(new File([blob], "print.png", { type: type }));
                    return;
                }
            }
        }
        alert("Nenhuma imagem encontrada na área de transferência.");
    } catch (erro) {
        console.error("Erro ao acessar a área de transferência:", erro);
        alert("Não foi possível acessar a área de transferência. Por favor, verifique as permissões.");
    }
}

// Função para mostrar o indicador de loading
function showLoading() {
    document.getElementById('loading').style.display = 'block';
}

// Função para esconder o indicador de loading
function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

async function processarFoto(imageFile) {
    try {
        showLoading(); // Mostra o indicador de loading
        const resultado = await Gemini(imageFile);
        hideLoading(); // Esconde o indicador de loading
        exibirResultados(resultado);
    } catch (erro) {
        hideLoading(); // Esconde o indicador de loading em caso de erro
        console.error("Erro ao processar a foto:", erro);
        alert("Ocorreu um erro ao processar a imagem. Por favor, tente novamente.");
    }
}

function exibirResultados(resultado) {
    const linksContent = document.getElementById('linksContent');
    const aulaContent = document.getElementById('aulaContent');

    // Parse o markdown e adicione o atributo target="_blank" a todos os links
    const parsedLinks = marked.parse(resultado.links);
    const parsedAula = marked.parse(resultado.aula);

    // Função para remover estilos inline e classes
    function limparEstilos(html) {
        return html.replace(/style="[^"]*"/g, '')
                   .replace(/class="[^"]*"/g, '')
                   .replace(/<a /g, '<a target="_blank" ');
    }

    linksContent.innerHTML = limparEstilos(parsedLinks);
    aulaContent.innerHTML = limparEstilos(parsedAula);

    // Mostrar o botão "Outra Questão"
    document.getElementById('outraQuestao').style.display = 'inline-block';

    // Forçar a aplicação dos estilos escuros
    document.querySelectorAll('.ac-panel *').forEach(el => {
        el.style.backgroundColor = 'var(--secondary-bg)';
        el.style.color = 'var(--text-color)';
    });
}

function outraQuestao() {
    // Limpar cache e cookies
    if (window.caches) {
        caches.keys().then(function(names) {
            for (let name of names)
                caches.delete(name);
        });
    }
    
    // Limpar localStorage e sessionStorage
    localStorage.clear();
    sessionStorage.clear();
    
    // Recarregar a página
    window.location.reload(true);
}

// Adicionar event listeners aos botões
document.addEventListener('DOMContentLoaded', () => {
    const tirarFotoBtn = document.getElementById('tirarFoto');
    const enviarPrintBtn = document.getElementById('enviarPrint');

    if (isMobileDevice()) {
        tirarFotoBtn.style.display = 'inline-block';
        enviarPrintBtn.style.display = 'none';
    } else {
        tirarFotoBtn.style.display = 'none';
        enviarPrintBtn.style.display = 'inline-block';
    }

    tirarFotoBtn.addEventListener('click', tirarFoto);
    document.getElementById('enviarFoto').addEventListener('click', enviarFoto);
    enviarPrintBtn.addEventListener('click', enviarPrint);
    document.getElementById('outraQuestao').addEventListener('click', outraQuestao);
});

// Inicializar o marked
marked.use({
    breaks: true,
    gfm: true
});

function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}


function tirarFoto() {
    // Criar elementos HTML
    const cameraContainer = document.createElement('div');
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const captureBtn = document.createElement('button');
    const closeBtn = document.createElement('button');

    // Configurar estilos
    cameraContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #000;
        z-index: 1000;
    `;
    video.style.cssText = `
        width: 100%;
        height: calc(100% - 100px);
        object-fit: cover;
    `;
    canvas.style.display = 'none';
    captureBtn.textContent = 'Tirar Foto';
    captureBtn.style.cssText = `
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
    `;
    closeBtn.textContent = 'Fechar';
    closeBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
    `;

    // Adicionar elementos ao DOM
    cameraContainer.appendChild(video);
    cameraContainer.appendChild(canvas);
    cameraContainer.appendChild(captureBtn);
    cameraContainer.appendChild(closeBtn);
    document.body.appendChild(cameraContainer);

    // Acessar a câmera
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
            video.srcObject = stream;
            video.play();
        })
        .catch(error => {
            console.error('Erro ao acessar a câmera:', error);
            alert('Não foi possível acessar a câmera.');
            cameraContainer.remove();
        });

    // Função para capturar a foto
    function capturarFoto() {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        
        // Aqui você pode processar ou enviar a imageDataUrl
        console.log('Foto capturada:', imageDataUrl);
        
        // Exemplo: criar uma imagem e exibi-la
        const img = document.createElement('img');
        img.src = imageDataUrl;
        img.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            max-width: 90%;
            max-height: 90%;
            z-index: 1001;
        `;
        document.body.appendChild(img);
        
        fecharCamera();
    }

    // Função para fechar a câmera
    function fecharCamera() {
        const stream = video.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        cameraContainer.remove();
    }

    // Adicionar event listeners
    captureBtn.addEventListener('click', capturarFoto);
    closeBtn.addEventListener('click', fecharCamera);
}