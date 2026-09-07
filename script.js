// БАЗА ДАННЫХ СЕРИЙ (ВСТАВЛЯТЬ ССЫЛКИ НА СЕРИИ И КАРТИНКИ СЮДА)
const seasonsData = {
    1: [
        { 
            title: "1 сезон 1 серия", 
            /* ВСТАВЛЯТЬ ССЫЛКУ НА СЕРИЮ СЮДА */ 
            videoUrl: "https://www.youtube.com/embed/b9EkMc79ZSU", 
            /* ВСТАВЛЯТЬ ССЫЛКУ НА ПОСТЕР/ОБЛОЖКУ СЮДА */ 
            thumb: "https://via.placeholder.com/300x160/1a1a1a/ffffff?text=1+Сезон+1+Серия" 
        },
        { 
            title: "1 сезон 2 серия", 
            /* ВСТАВЛЯТЬ ССЫЛКУ НА СЕРИЮ СЮДА */ 
            videoUrl: "https://www.youtube.com/embed/b9EkMc79ZSU", 
            /* ВСТАВЛЯТЬ ССЫЛКУ НА ПОСТЕР/ОБЛОЖКУ СЮДА */ 
            thumb: "https://via.placeholder.com/300x160/1a1a1a/ffffff?text=1+Сезон+2+Серия" 
        },
        { 
            title: "1 сезон 3 серия", 
            /* ВСТАВЛЯТЬ ССЫЛКУ НА СЕРИЮ СЮДА */ 
            videoUrl: "https://www.youtube.com/embed/b9EkMc79ZSU", 
            /* ВСТАВЛЯТЬ ССЫЛКУ НА ПОСТЕР/ОБЛОЖКУ СЮДА */ 
            thumb: "https://via.placeholder.com/300x160/1a1a1a/ffffff?text=1+Сезон+3+Серия" 
        },
        { 
            title: "1 сезон 4 серия", 
            videoUrl: "https://www.youtube.com/embed/b9EkMc79ZSU", 
            thumb: "https://via.placeholder.com/300x160/1a1a1a/ffffff?text=1+Сезон+4+Серия" 
        },
        { 
            title: "1 сезон 5 серия", 
            videoUrl: "https://www.youtube.com/embed/b9EkMc79ZSU", 
            thumb: "https://via.placeholder.com/300x160/1a1a1a/ffffff?text=1+Сезон+5+Серия" 
        },
        { 
            title: "1 сезон 6 серия", 
            videoUrl: "https://www.youtube.com/embed/b9EkMc79ZSU", 
            thumb: "https://via.placeholder.com/300x160/1a1a1a/ffffff?text=1+Сезон+6+Серия" 
        },
        { 
            title: "1 сезон 7 серия", 
            videoUrl: "https://www.youtube.com/embed/b9EkMc79ZSU", 
            thumb: "https://via.placeholder.com/300x160/1a1a1a/ffffff?text=1+Сезон+7+Серия" 
        },
        { 
            title: "1 сезон 8 серия", 
            videoUrl: "https://www.youtube.com/embed/b9EkMc79ZSU", 
            thumb: "https://via.placeholder.com/300x160/1a1a1a/ffffff?text=1+Сезон+8+Серия" 
        }
    ],
    2: [
        { 
            title: "2 сезон 1 серия", 
            /* ВСТАВЛЯТЬ ССЫЛКУ НА СЕРИЮ СЮДА */ 
            videoUrl: "https://www.youtube.com/embed/vgS2L7WPIO4", 
            /* ВСТАВЛЯТЬ ССЫЛКУ НА ПОСТЕР/ОБЛОЖКУ СЮДА */ 
            thumb: "https://via.placeholder.com/300x160/221111/ffffff?text=2+Сезон+1+Серия" 
        }
    ]
};

const episodesContainer = document.getElementById('episodes-container');
const seasonBtns = document.querySelectorAll('.season-btn');
const modal = document.getElementById('modal-player');
const iframe = document.getElementById('video-frame');
const closeBtn = document.getElementById('modal-close');

function renderEpisodes(seasonNumber) {
    episodesContainer.innerHTML = '';
    const list = seasonsData[seasonNumber] || [];

    list.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${item.thumb}" alt="${item.title}">
            <div class="card-title"><span class="play-icon">►</span> ${item.title}</div>
        `;
        card.onclick = () => playVideo(item.videoUrl);
        episodesContainer.appendChild(card);
    });
}

function switchSeason(seasonNum) {
    seasonBtns.forEach((btn, index) => {
        btn.classList.toggle('active', index + 1 === seasonNum);
    });
    renderEpisodes(seasonNum);
}

function playVideo(url) {
    iframe.src = url;
    modal.style.display = 'flex';
}

closeBtn.onclick = () => {
    modal.style.display = 'none';
    iframe.src = '';
};

// Запуск отображения первого сезона
renderEpisodes(1);
