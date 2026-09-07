// База данных серий (Редактируйте ссылки и превью здесь)
const seasonsData = {
    1: [
        { 
            title: "1 сезон 1 серия", 
            // ВСТАВЛЯТЬ ССЫЛКУ НА СЕРИЮ СЮДА (ссылка на плеер/iframe)
            videoUrl: "https://www.youtube.com/embed/b9EkMc79ZSU", 
            // ВСТАВЛЯТЬ ССЫЛКУ НА СЕРИЮ СЮДА (ссылка на обложку серии)
            thumb: "https://via.placeholder.com/300x160/222/fff?text=1+Сезон+1+Серия" 
        },
        { 
            title: "1 сезон 2 серия", 
            // ВСТАВЛЯТЬ ССЫЛКУ НА СЕРИЮ СЮДА
            videoUrl: "https://www.youtube.com/embed/b9EkMc79ZSU", 
            // ВСТАВЛЯТЬ ССЫЛКУ НА СЕРИЮ СЮДА
            thumb: "https://via.placeholder.com/300x160/222/fff?text=1+Сезон+2+Серия" 
        },
        { 
            title: "1 сезон 3 серия", 
            videoUrl: "https://www.youtube.com/embed/b9EkMc79ZSU", 
            thumb: "https://via.placeholder.com/300x160/222/fff?text=1+Сезон+3+Серия" 
        }
    ],
    2: [
        { 
            title: "2 сезон 1 серия", 
            videoUrl: "https://www.youtube.com/embed/vgS2L7WPIO4", 
            thumb: "https://via.placeholder.com/300x160/331111/fff?text=2+Сезон+1+Серия" 
        }
    ]
};

const episodesContainer = document.getElementById('episodes-container');
const tabButtons = document.querySelectorAll('.tab-btn');
const modal = document.getElementById('player-modal');
const iframe = document.getElementById('video-iframe');
const closeModal = document.getElementById('close-modal');

function renderEpisodes(seasonNumber) {
    episodesContainer.innerHTML = '';
    const list = seasonsData[seasonNumber] || [];

    list.forEach(ep => {
        const card = document.createElement('div');
        card.className = 'episode-card';
        card.innerHTML = `
            <img src="${ep.thumb}" alt="${ep.title}">
            <div class="episode-title">▶ ${ep.title}</div>
        `;
        card.onclick = () => openPlayer(ep.videoUrl);
        episodesContainer.appendChild(card);
    });
}

function switchSeason(seasonNum) {
    tabButtons.forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.season) === seasonNum);
    });
    renderEpisodes(seasonNum);
}

tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        switchSeason(parseInt(btn.dataset.season));
    });
});

function openPlayer(url) {
    iframe.src = url;
    modal.style.display = 'flex';
}

closeModal.onclick = () => {
    modal.style.display = 'none';
    iframe.src = '';
};

// Инициализация первой вкладки
renderEpisodes(1);
