const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureBtn = document.getElementById('captureBtn');
const colorBox = document.getElementById('colorBox');
const colorName = document.getElementById('colorName');

// Acessa a câmera
navigator.mediaDevices.getUserMedia({ video: true })
.then(stream => {
    video.srcObject = stream;
})
.catch(err => {
    alert('Erro ao acessar a câmera: ' + err);
});

// Lista de cores comuns (nome e RGB)
const COLORS = [
    { name: 'Vermelho', r: 255, g: 0, b: 0 },
    { name: 'Verde', r: 0, g: 255, b: 0 },
    { name: 'Azul', r: 0, g: 0, b: 255 },
    { name: 'Amarelo', r: 255, g: 255, b: 0 },
    { name: 'Ciano', r: 0, g: 255, b: 255 },
    { name: 'Magenta', r: 255, g: 0, b: 255 },
    { name: 'Laranja', r: 255, g: 165, b: 0 },
    { name: 'Rosa', r: 255, g: 192, b: 203 },
    { name: 'Roxo', r: 128, g: 0, b: 128 },
    { name: 'Marrom', r: 150, g: 75, b: 0 },
    { name: 'Cinza', r: 128, g: 128, b: 128 },
    { name: 'Preto', r: 0, g: 0, b: 0 },
    { name: 'Branco', r: 255, g: 255, b: 255 },
    { name: 'Verde-limão', r: 50, g: 205, b: 50 },
    { name: 'Azul-claro', r: 173, g: 216, b: 230 },
    { name: 'Bege', r: 245, g: 245, b: 220 },
    { name: 'Vermelho-escuro', r: 139, g: 0, b: 0 },
    { name: 'Verde-escuro', r: 0, g: 100, b: 0 },
    { name: 'Azul-escuro', r: 0, g: 0, b: 139 },
    { name: 'Turquesa', r: 64, g: 224, b: 208 }
];

// Calcula a cor dominante
function getDominantColor(context, width, height) {
    const imageData = context.getImageData(0, 0, width, height);
    const data = imageData.data;
    let r=0, g=0, b=0, count=0;

    for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i+1];
        b += data[i+2];
        count++;
    }

    r = Math.round(r/count);
    g = Math.round(g/count);
    b = Math.round(b/count);

    return {r, g, b};
}

// Converte RGB para nome usando distância mínima
function rgbToName(r, g, b) {
    let minDistance = Infinity;
    let closestColor = 'Cor desconhecida';

    COLORS.forEach(c => {
        const distance = Math.sqrt(
            Math.pow(r - c.r, 2) +
            Math.pow(g - c.g, 2) +
            Math.pow(b - c.b, 2)
        );
        if(distance < minDistance){
            minDistance = distance;
            closestColor = c.name;
        }
    });

    return closestColor;
}

// Calcula cor complementar
function getComplementaryColor(r, g, b) {
    return { r: 255 - r, g: 255 - g, b: 255 - b };
}

// Mostra paleta na tela
function showPalette(r, g, b) {
    const paletteDiv = document.getElementById('palette');
    paletteDiv.innerHTML = '';

    const complementary = getComplementaryColor(r, g, b);

    const colors = [
        { r, g, b },
        complementary
    ];

    colors.forEach(c => {
        const div = document.createElement('div');
        div.className = 'palette-color';
        div.style.backgroundColor = `rgb(${c.r},${c.g},${c.b})`;
        paletteDiv.appendChild(div);
    });
}

// Captura cor ao clicar
captureBtn.addEventListener('click', () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const { r, g, b } = getDominantColor(ctx, canvas.width, canvas.height);
    colorBox.style.backgroundColor = `rgb(${r},${g},${b})`;
    colorName.textContent = rgbToName(r, g, b);

    showPalette(r, g, b);
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
        .then(reg => console.log('Service Worker registrado!'))
        .catch(err => console.log('Erro ao registrar SW:', err));
    });
}