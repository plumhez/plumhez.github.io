const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const fileInput = document.getElementById('file-input');
const dropZone = document.getElementById('drop-zone');
const placeholder = document.getElementById('placeholder');
const buttons = document.querySelectorAll('.btn');

let currentImage = null;
let activeFilter = 'none';

// Выбор файла
dropZone.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', handleFile);

dropZone.addEventListener('dragover', (e) => e.preventDefault());
dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) {
        fileInput.files = e.dataTransfer.files;
        handleFile();
    }
});

function handleFile() {
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            currentImage = img;
            placeholder.style.display = 'none';
            applyCurrentFilter();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// Переключение кнопок
buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.dataset.filter;
        applyCurrentFilter();
    });
});

function applyCurrentFilter() {
    if (!currentImage) return;

    // Ресайзим canvas под картинку (максимум 640px по ширине для сохранения ретро-качества)
    const scale = Math.min(1, 640 / currentImage.width);
    canvas.width = currentImage.width * scale;
    canvas.height = currentImage.height * scale;

    ctx.drawImage(currentImage, 0, 0, canvas.width, canvas.height);
    
    let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imgData.data;

    if (activeFilter === 'vhs') {
        // Хроматическая аберрация (сдвиг красного и синего) + мелкий шум
        let copy = new Uint8ClampedArray(data);
        const shift = Math.floor(canvas.width * 0.008) * 4;
        
        for (let i = 0; i < data.length; i += 4) {
            // Сдвиг красного канала
            if (i + shift < data.length) data[i] = copy[i + shift]; 
            // Добавление шума зернистости
            let noise = (Math.random() - 0.5) * 40;
            data[i] = Math.min(255, Math.max(0, data[i] + noise));
            data[i+1] = Math.min(255, Math.max(0, data[i+1] + noise));
            data[i+2] = Math.min(255, Math.max(0, data[i+2] + noise));
        }
    } 
    else if (activeFilter === 'cctv') {
        // Зеленоватый монохром камеры наблюдения с контрастом
        for (let i = 0; i < data.length; i += 4) {
            let avg = (data[i] * 0.3 + data[i+1] * 0.59 + data[i+2] * 0.11);
            avg = avg < 50 ? avg * 0.5 : avg * 1.2; // контраст
            let noise = (Math.random() - 0.5) * 50;
            
            data[i] = Math.max(0, avg * 0.4 + noise);     // Red
            data[i+1] = Math.min(255, avg + noise + 20); // Green
            data[i+2] = Math.max(0, avg * 0.4 + noise);   // Blue
        }
    } 
    else if (activeFilter === 'threshold') {
        // 1-битный жесткий порог (Черно-белый газетный/компьютерный стиль)
        for (let i = 0; i < data.length; i += 4) {
            let avg = (data[i] + data[i+1] + data[i+2]) / 3;
            let v = (avg > 110) ? 255 : 0;
            data[i] = v;
            data[i+1] = v;
            data[i+2] = v;
        }
    } 
    else if (activeFilter === 'thermal') {
        // Симуляция инфракрасной камеры
        for (let i = 0; i < data.length; i += 4) {
            let avg = (data[i] + data[i+1] + data[i+2]) / 3;
            data[i] = avg > 128 ? 255 : avg * 2;          // R
            data[i+1] = avg < 128 ? avg * 2 : 255 - avg;  // G
            data[i+2] = 255 - avg;                        // B
        }
    }

    ctx.putImageData(imgData, 0, 0);
}

// Живые часы на нижней панели
setInterval(() => {
    const now = new Date();
    document.getElementById('timestamp').innerText = 
        now.toISOString().replace('T', ' ').substring(0, 19);
}, 1000);
