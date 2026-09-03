const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const fileInput = document.getElementById('file-input');
const dropZone = document.getElementById('drop-zone');
const placeholder = document.getElementById('placeholder');
const buttons = document.querySelectorAll('.controls .btn:not(#btn-glitch)');
const glitchBtn = document.getElementById('btn-glitch');

let currentImage = null;
let activeFilter = 'mandela';
let glitchEnabled = false;

dropZone.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', handleFile);

function handleFile() {
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            currentImage = img;
            placeholder.style.display = 'none';
            render();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// Фильтры
buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.dataset.filter;
        render();
    });
});

// Кнопка включения/выключения помех
glitchBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    glitchEnabled = !glitchEnabled;
    glitchBtn.classList.toggle('active-glitch', glitchEnabled);
    render();
});

function render() {
    if (!currentImage) return;

    // Снижаем внутреннее разрешение для эффекта низкого качества VHS
    const targetWidth = 500;
    const scale = targetWidth / currentImage.width;
    canvas.width = targetWidth;
    canvas.height = currentImage.height * scale;

    ctx.drawImage(currentImage, 0, 0, canvas.width, canvas.height);
    
    let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imgData.data;

    // 1. Стиль Mandela Catalogue (Выбитые тени + ч/б + тяжелое зерно)
    if (activeFilter === 'mandela') {
        for (let i = 0; i < data.length; i += 4) {
            let gray = data[i] * 0.299 + data[i+1] * 0.587 + data[i+2] * 0.114;
            
            // Выкручиваем S-кривую контраста (темные области становятся черными)
            if (gray < 80) {
                gray = gray * 0.5;
            } else if (gray > 160) {
                gray = Math.min(255, gray * 1.25);
            }

            // Интенсивная зернистость (Film Grain)
            let grain = (Math.random() - 0.5) * 65;
            gray = Math.min(255, Math.max(0, gray + grain));

            data[i] = gray;
            data[i+1] = gray;
            data[i+2] = gray;
        }
    } 
    // 2. Альтернативный фильтр "Alternate" (Искажение черных глаз и губ)
    else if (activeFilter === 'intruder') {
        for (let i = 0; i < data.length; i += 4) {
            let gray = data[i] * 0.299 + data[i+1] * 0.587 + data[i+2] * 0.114;
            
            // Агрессивный порог теней для эффекта "Затемненного лица"
            gray = gray < 100 ? gray * 0.2 : gray * 1.3;

            let grain = (Math.random() - 0.5) * 45;
            gray = Math.min(255, Math.max(0, gray + grain));

            data[i] = gray;
            data[i+1] = gray * 0.95; // Минимальный зеленый оттенок старого кинескопа
            data[i+2] = gray * 0.9;
        }
    }

    ctx.putImageData(imgData, 0, 0);

    // 3. Отдельная функция: генерация помех поверх изображения
    if (glitchEnabled) {
        applyVHSGlitch();
    }
}

function applyVHSGlitch() {
    let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imgData.data;
    const width = canvas.width;
    const height = canvas.height;

    // 1. Горизонтальный сдвиг полос (Tracking Errors)
    const numCorruptLines = Math.floor(Math.random() * 8) + 4;
    for (let i = 0; i < numCorruptLines; i++) {
        let startY = Math.floor(Math.random() * height);
        let lineHeight = Math.floor(Math.random() * 6) + 1;
        let offsetX = (Math.random() - 0.5) * 40; // Смещение по X

        for (let y = startY; y < Math.min(height, startY + lineHeight); y++) {
            for (let x = 0; x < width; x++) {
                let sourceX = Math.floor(x + offsetX);
                if (sourceX >= 0 && sourceX < width) {
                    let destIdx = (y * width + x) * 4;
                    let srcIdx = (y * width + sourceX) * 4;

                    data[destIdx] = data[srcIdx];
                    data[destIdx + 1] = data[srcIdx + 1];
                    data[destIdx + 2] = data[srcIdx + 2];
                }
            }
        }
    }

    // 2. Белые шумы и «снег» в нижней части кадра (как на кассетах)
    for (let i = 0; i < data.length; i += 4) {
        if (Math.random() < 0.08) { // 8% случайных битых пикселей
            let noiseVal = Math.random() > 0.5 ? 255 : 0;
            data[i] = noiseVal;
            data[i+1] = noiseVal;
            data[i+2] = noiseVal;
        }
    }

    ctx.putImageData(imgData, 0, 0);
}

// Часы
setInterval(() => {
    const now = new Date();
    document.getElementById('timestamp').innerText = 
        now.toISOString().replace('T', ' ').substring(0, 19);
}, 1000);
