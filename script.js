
const menu = document.getElementById('menu');

function closeNavbar() {
    menu.classList.remove('max-md:left-0');
    menu.classList.add('max-md:-left-full');
}

function openNavbar() {
    menu.classList.remove('max-md:-left-full');
    menu.classList.add('max-md:left-0');
}

// Fetch et affichage des animes populaires dans le carrousel
async function loadPopularAnime() {
    const container = document.getElementById('popular-carousel');
    if (!container) return;

    try {
        // Récupération des 9 animes les plus populaires via l'API Jikan
        const response = await fetch('https://api.jikan.moe/v4/top/anime?limit=9');
        const data = await response.json();
        const animes = data.data;

        container.innerHTML = ''; // Vider le texte de chargement

        // Dupliquer les données pour créer l'effet de boucle infinie sur tous les écrans (4 sets pour couvrir les grands écrans)
        const infiniteAnimes = [...animes, ...animes, ...animes, ...animes];

        infiniteAnimes.forEach((anime) => {
            const card = document.createElement('a');
            card.href = `details.html?type=anime&id=${anime.mal_id}`;
            // Styles de la carte pour le carrousel infini
            card.className = 'relative block w-[220px] md:w-[260px] h-[320px] md:h-[380px] shrink-0 rounded-3xl overflow-hidden cursor-pointer group bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-2';
            
            const genres = anime.genres ? anime.genres.map(g => g.name).join(', ') : 'No genre';
            card.innerHTML = `
                <img src="${anime.images.webp.large_image_url}" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="${anime.title}">
                <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <!-- Contenu de la carte -->
                <div class="absolute inset-0 p-6 flex flex-col justify-end">
                    <div class="transform transition-transform duration-300 group-hover:-translate-y-2 translate-y-4">
                        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/20 text-green-400 font-bold text-xs backdrop-blur-sm mb-3 border border-green-500/30 w-fit">
                            ★ ${anime.score}
                        </span>
                        <h3 class="text-white text-xl md:text-2xl font-bold leading-tight mb-2 line-clamp-2">${anime.title}</h3>
                        <p class="text-gray-300 text-sm line-clamp-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">${genres}</p>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });

        // --- Système de défilement infini et contrôle à la molette ---
        const maxSpeed = 0.7;
        let targetSpeed = maxSpeed;
        let currentSpeed = maxSpeed;

        // Mise en pause au survol de la souris
        container.addEventListener('mouseenter', () => targetSpeed = 0);
        container.addEventListener('mouseleave', () => targetSpeed = maxSpeed);

        // Boucle d'animation fluide
        function scrollLoop() {
            // Interpolation pour un ralentissement et une accélération en douceur
            currentSpeed += (targetSpeed - currentSpeed) * 0.05;
            container.scrollLeft += currentSpeed;

            const halfWidth = container.scrollWidth / 2;

            // Réinitialisation invisible pour créer la boucle infinie (s'adapte dans les 2 sens)
            if (container.scrollLeft >= halfWidth) {
                container.scrollLeft -= halfWidth;
            } else if (container.scrollLeft <= 0) {
                container.scrollLeft += halfWidth - 1;
            }

            requestAnimationFrame(scrollLoop);
        }

        // Lancement de l'animation
        scrollLoop();

    } catch (error) {
        console.error('Error loading anime:', error);
        container.innerHTML = '<div class="text-red-500 w-full text-center">Error loading data.</div>';
    }
}

// Fetch et affichage des animes Top Rated
async function loadTopRatedAnime() {
    const container = document.getElementById('top-rated-grid');
    if (!container) return;

    try {
        // Récupération du top 6 des meilleurs animes
        const response = await fetch('https://api.jikan.moe/v4/top/anime?limit=6');
        const data = await response.json();
        const animes = data.data;

        container.innerHTML = ''; // Vider le texte de chargement

        animes.forEach((anime, index) => {
            const card = document.createElement('a');
            card.href = `details.html?type=anime&id=${anime.mal_id}`;
            // Styles de la carte : thème sombre, glassmorphism et bordure subtile
            card.className = 'flex items-center gap-4 p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl hover:bg-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-300 group cursor-pointer relative overflow-hidden';
            
            const genres = anime.genres ? anime.genres.map(g => g.name).join(', ') : 'No genre';
            card.innerHTML = `
                <!-- Grand numéro de classement en filigrane discret -->
                <div class="absolute -right-4 -bottom-6 text-9xl font-black text-white/5 group-hover:text-white/10 transition-colors z-0 pointer-events-none select-none">
                    ${index + 1}
                </div>
                
                <!-- Miniature -->
                <div class="relative z-10 shrink-0 overflow-hidden rounded-2xl w-24 h-32 shadow-lg">
                    <img src="${anime.images.webp.large_image_url}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="${anime.title}">
                </div>
                
                <!-- Informations texte -->
                <div class="relative z-10 flex flex-col justify-center py-1 h-full flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1.5">
                        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-green-500/20 text-green-400 border border-green-500/30 font-bold text-xs">
                            ★ ${anime.score}
                        </span>
                    <span class="text-xs text-gray-400 font-medium">${anime.year || 'N/A'} • ${anime.episodes ? anime.episodes + ' ep' : 'Ongoing'}</span>
                    </div>
                    <h3 class="text-white font-bold text-lg leading-tight mb-1.5 truncate group-hover:text-green-400 transition-colors">${anime.title}</h3>
                    <p class="text-gray-400 text-xs line-clamp-2 leading-relaxed">${genres}</p>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading top rated anime:', error);
        container.innerHTML = '<div class="text-red-500 col-span-full text-center py-8">Error loading data.</div>';
    }
}

// Fonction utilitaire pour créer un délai
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Lancer les fonctions au chargement de la page
document.addEventListener('DOMContentLoaded', async () => {
    await loadPopularAnime();
    await delay(400); // Pause de 400ms pour respecter la limite (3 req/sec)
    await loadTopRatedAnime();
    await delay(400);
    await loadPopularManga();
    await delay(400);
    await loadTopRatedManga();
});

// Fetch et affichage des mangas populaires dans le carrousel
async function loadPopularManga() {
    const container = document.getElementById('popular-manga-carousel');
    if (!container) return;

    try {
        // Récupération des 9 mangas les plus populaires via l'API Jikan
        const response = await fetch('https://api.jikan.moe/v4/top/manga?limit=9');
        const data = await response.json();
        const mangas = data.data;

        container.innerHTML = '';

        // Duplication pour couvrir de très grandes largeurs d'écran
        const infiniteMangas = [...mangas, ...mangas, ...mangas, ...mangas];

        infiniteMangas.forEach((manga) => {
            const card = document.createElement('a');
            card.href = `details.html?type=manga&id=${manga.mal_id}`;
            card.className = 'relative block w-[220px] md:w-[260px] h-[320px] md:h-[380px] shrink-0 rounded-3xl overflow-hidden cursor-pointer group bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-2';
            
            const genres = manga.genres ? manga.genres.map(g => g.name).join(', ') : 'No genre';
            card.innerHTML = `
                <img src="${manga.images.webp.large_image_url}" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="${manga.title}">
                <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div class="absolute inset-0 p-6 flex flex-col justify-end">
                    <div class="transform transition-transform duration-300 group-hover:-translate-y-2 translate-y-4">
                        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 font-bold text-xs backdrop-blur-sm mb-3 border border-blue-500/30 w-fit">
                            ★ ${manga.score}
                        </span>
                        <h3 class="text-white text-xl md:text-2xl font-bold leading-tight mb-2 line-clamp-2">${manga.title}</h3>
                        <p class="text-gray-300 text-sm line-clamp-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">${genres}</p>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });

        const maxSpeed = 0.7;
        let targetSpeed = maxSpeed;
        let currentSpeed = maxSpeed;

        container.addEventListener('mouseenter', () => targetSpeed = 0);
        container.addEventListener('mouseleave', () => targetSpeed = maxSpeed);

        function scrollLoop() {
            currentSpeed += (targetSpeed - currentSpeed) * 0.05;
            container.scrollLeft += currentSpeed;

            const halfWidth = container.scrollWidth / 2;

            if (container.scrollLeft >= halfWidth) {
                container.scrollLeft -= halfWidth;
            } else if (container.scrollLeft <= 0) {
                container.scrollLeft += halfWidth - 1;
            }

            requestAnimationFrame(scrollLoop);
        }

        scrollLoop();

    } catch (error) {
        console.error('Error loading manga:', error);
        container.innerHTML = '<div class="text-red-500 w-full text-center">Error loading data.</div>';
    }
}

// Fetch et affichage des mangas Top Rated
async function loadTopRatedManga() {
    const container = document.getElementById('top-rated-manga-grid');
    if (!container) return;

    try {
        const response = await fetch('https://api.jikan.moe/v4/top/manga?limit=6');
        const data = await response.json();
        const mangas = data.data;

        container.innerHTML = ''; 

        mangas.forEach((manga, index) => {
            const card = document.createElement('a');
            card.href = `details.html?type=manga&id=${manga.mal_id}`;
            // J'ai modifié les couleurs hover pour utiliser du bleu au lieu du vert pour différencier du Anime
            card.className = 'flex items-center gap-4 p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl hover:bg-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 group cursor-pointer relative overflow-hidden';
            
            // Gérer le cas où l'année de publication n'est pas directement sous 'year'
            const year = manga.published?.prop?.from?.year || 'N/A';
            // Gérer l'affichage des chapitres au lieu des épisodes
            const duration = manga.chapters ? manga.chapters + ' ch' : 'Ongoing';

            const genres = manga.genres ? manga.genres.map(g => g.name).join(', ') : 'No genre';
            card.innerHTML = `
                <div class="absolute -right-4 -bottom-6 text-9xl font-black text-white/5 group-hover:text-white/10 transition-colors z-0 pointer-events-none select-none">
                    ${index + 1}
                </div>
                
                <div class="relative z-10 shrink-0 overflow-hidden rounded-2xl w-24 h-32 shadow-lg">
                    <img src="${manga.images.webp.large_image_url}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="${manga.title}">
                </div>
                
                <div class="relative z-10 flex flex-col justify-center py-1 h-full flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1.5">
                        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold text-xs">
                            ★ ${manga.score}
                        </span>
                        <span class="text-xs text-gray-400 font-medium">${year} • ${duration}</span>
                    </div>
                    <h3 class="text-white font-bold text-lg leading-tight mb-1.5 truncate group-hover:text-blue-400 transition-colors">${manga.title}</h3>
                    <p class="text-gray-400 text-xs line-clamp-2 leading-relaxed">${genres}</p>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading top rated manga:', error);
        container.innerHTML = '<div class="text-red-500 col-span-full text-center py-8">Error loading data.</div>';
    }
}

// --- Logique de la page Tous les Animes (animes.html) ---
let currentAnimePage = 1;
let currentSearchQuery = '';

async function loadAllAnimes(page = 1, query = '') {
    const grid = document.getElementById('anime-grid');
    if (!grid) return; // S'assure qu'on est sur animes.html

    // État de chargement
    grid.innerHTML = `
        <div class="col-span-full flex flex-col items-center justify-center text-gray-500 py-20">
            <span class="relative flex h-8 w-8 mb-4">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00C896] opacity-75"></span>
                <span class="relative inline-flex rounded-full h-8 w-8 bg-[#00C896]"></span>
            </span>
        Loading anime...
        </div>
    `;
    
    try {
        // limit=20 correspond exactement à 4 colonnes et 5 lignes sur écrans larges
        let url = `https://api.jikan.moe/v4/anime?page=${page}&limit=20`;
        if (query) {
            url += `&q=${encodeURIComponent(query)}`;
        }

        const response = await fetch(url);
        
        if (response.status === 429) {
            grid.innerHTML = '<div class="col-span-full text-center text-orange-500 py-20 font-medium">Too many API requests. Please wait a moment and try again.</div>';
            return;
        }

        const data = await response.json();
        const animes = data.data;

        grid.innerHTML = '';

        if (!animes || animes.length === 0) {
            grid.innerHTML = `
                <div class="col-span-full text-center text-gray-500 py-20 flex flex-col items-center">
                    <svg class="w-16 h-16 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                No anime found for "${query}".
                </div>
            `;
            updatePaginationControls(1, false);
            return;
        }

        animes.forEach(anime => {
            const card = document.createElement('a');
            card.href = `details.html?type=anime&id=${anime.mal_id}`;
            card.className = 'relative block flex-col h-[350px] rounded-3xl overflow-hidden cursor-pointer group bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-2 shadow-lg hover:shadow-2xl hover:shadow-[#00C896]/10';
            
            const primaryGenre = anime.genres && anime.genres.length > 0 ? anime.genres[0].name : 'Anime';
            const allGenres = anime.genres ? anime.genres.map(g => g.name).join(', ') : 'No genre';
            const score = anime.score ? anime.score.toFixed(1) : 'N/A';

            card.innerHTML = `
                <img src="${anime.images.webp.large_image_url}" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="${anime.title}">
                <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div class="absolute top-4 right-4 z-10">
                    <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 text-white font-bold text-xs backdrop-blur-md border border-white/10 shadow-sm">
                        ★ ${score}
                    </span>
                </div>

                <div class="absolute inset-0 p-5 flex flex-col justify-end">
                    <div class="transform transition-transform duration-300 group-hover:-translate-y-2 translate-y-4">
                        <span class="inline-block px-2.5 py-1 rounded-md bg-[#00C896]/20 text-[#00C896] border border-[#00C896]/30 font-bold text-xs backdrop-blur-sm mb-2">
                            ${primaryGenre}
                        </span>
                        <h3 class="text-white text-lg font-bold leading-tight mb-2 line-clamp-2 drop-shadow-md">${anime.title}</h3>
                        <p class="text-gray-300 text-xs line-clamp-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 leading-relaxed">${allGenres}</p>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });

        updatePaginationControls(data.pagination.current_page, data.pagination.has_next_page);

    } catch (error) {
        console.error('Error loading anime:', error);
        grid.innerHTML = '<div class="text-red-500 col-span-full text-center py-20 font-medium">Error loading data.</div>';
    }
}

function updatePaginationControls(currentPage, hasNextPage) {
    currentAnimePage = currentPage;
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const pageIndicator = document.getElementById('page-indicator');

    if (pageIndicator) pageIndicator.textContent = currentPage;
    if (prevBtn) prevBtn.disabled = currentPage <= 1;
    if (nextBtn) nextBtn.disabled = !hasNextPage;
}

// Lancement des écouteurs pour animes.html
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('anime-grid')) {
        loadAllAnimes(currentAnimePage, currentSearchQuery);

        const searchBtn = document.getElementById('search-btn');
        const searchInput = document.getElementById('search-input');
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');

        const performSearch = () => {
            currentSearchQuery = searchInput.value.trim();
            loadAllAnimes(1, currentSearchQuery);
        };

        if (searchBtn && searchInput) {
            searchBtn.addEventListener('click', performSearch);
            searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') performSearch(); });
        }

        if (prevBtn) prevBtn.addEventListener('click', () => { if (currentAnimePage > 1) loadAllAnimes(currentAnimePage - 1, currentSearchQuery); });
        if (nextBtn) nextBtn.addEventListener('click', () => loadAllAnimes(currentAnimePage + 1, currentSearchQuery));
    }
});

// --- Logique de la page Random (random.html) ---

async function loadRandom(type) {
    const container = document.getElementById('random-content');
    if (!container) return;

    // Couleur dynamique selon le type (Anime = Vert, Manga = Blanc/Gris)
    const themeColor = type === 'anime' ? 'bg-[#00C896]' : 'bg-gray-400';

    container.innerHTML = `
        <div class="flex flex-col items-center justify-center text-gray-500 py-20 border-t border-white/10 mt-8">
            <span class="relative flex h-12 w-12 mb-4">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full ${themeColor} opacity-75"></span>
                <span class="relative inline-flex rounded-full h-12 w-12 ${themeColor}"></span>
            </span>
            Loading a random ${type}...
        </div>
    `;

    try {
        let data = null;
        let isSafe = false;
        let attempts = 0;
        const maxAttempts = 10;

        while (!isSafe && attempts < maxAttempts) {
            attempts++;
            const response = await fetch(`https://api.jikan.moe/v4/random/${type}`);
            
            if (response.status === 429) {
                if (attempts === 1) {
                    container.innerHTML = '<div class="text-center text-orange-500 py-20 font-medium">Too many API requests. Please wait a moment and try again.</div>';
                    return;
                }
                await new Promise(r => setTimeout(r, 1000));
                continue;
            }
            
            if (!response.ok) throw new Error(`API error: ${response.statusText}`);
            
            const result = await response.json();
            data = result.data;
            
            // Vérification des ratings (pour l'anime) et des genres (pour les 2)
            const isRx = data.rating && data.rating.toLowerCase().includes('rx');
            const isHentai = data.genres && data.genres.some(g => ['hentai', 'erotica', 'adult'].includes(g.name.toLowerCase()));
            
            if (!isRx && !isHentai) {
                isSafe = true;
            } else if (attempts < maxAttempts) {
                // Pause de 500ms avant de réessayer pour respecter la limite de l'API
                await new Promise(r => setTimeout(r, 500));
            }
        }

        if (isSafe && data) {
            renderDetailView(container, data, type);
        } else {
            container.innerHTML = `<div class="text-red-500 text-center py-20">Could not find a safe ${type} after several attempts. Please try again.</div>`;
        }

    } catch (error) {
        console.error(`Error loading random ${type}:`, error);
        container.innerHTML = `<div class="text-red-500 text-center py-20">Failed to load a random ${type}. Please try again.</div>`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const btnRandomAnime = document.getElementById('btn-random-anime');
    const btnRandomManga = document.getElementById('btn-random-manga');

    if (btnRandomAnime) {
        btnRandomAnime.addEventListener('click', () => loadRandom('anime'));
    }
    if (btnRandomManga) {
        btnRandomManga.addEventListener('click', () => loadRandom('manga'));
    }
});

// --- Logique de la page Tous les Mangas (mangas.html) ---
let currentMangaPage = 1;
let currentMangaSearchQuery = '';

async function loadAllMangas(page = 1, query = '') {
    const grid = document.getElementById('manga-grid');
    if (!grid) return; // S'assure qu'on est sur mangas.html

    grid.innerHTML = `
        <div class="col-span-full flex flex-col items-center justify-center text-gray-500 py-20">
            <span class="relative flex h-8 w-8 mb-4">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00C896] opacity-75"></span>
                <span class="relative inline-flex rounded-full h-8 w-8 bg-[#00C896]"></span>
            </span>
        Loading manga...
        </div>
    `;
    
    try {
        let url = `https://api.jikan.moe/v4/manga?page=${page}&limit=20`;
        if (query) {
            url += `&q=${encodeURIComponent(query)}`;
        }

        const response = await fetch(url);
        
        if (response.status === 429) {
            grid.innerHTML = '<div class="col-span-full text-center text-orange-500 py-20 font-medium">Too many API requests. Please wait a moment and try again.</div>';
            return;
        }

        const data = await response.json();
        const mangas = data.data;

        grid.innerHTML = '';

        if (!mangas || mangas.length === 0) {
            grid.innerHTML = `
                <div class="col-span-full text-center text-gray-500 py-20 flex flex-col items-center">
                    <svg class="w-16 h-16 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                No manga found for "${query}".
                </div>
            `;
            updateMangaPaginationControls(1, false);
            return;
        }

        mangas.forEach(manga => {
            const card = document.createElement('a');
            card.href = `details.html?type=manga&id=${manga.mal_id}`;
            card.className = 'relative block flex-col h-[350px] rounded-3xl overflow-hidden cursor-pointer group bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-2 shadow-lg hover:shadow-2xl hover:shadow-blue-500/10';
            
            const primaryGenre = manga.genres && manga.genres.length > 0 ? manga.genres[0].name : 'Manga';
            const allGenres = manga.genres ? manga.genres.map(g => g.name).join(', ') : 'No genre';
            const score = manga.score ? manga.score.toFixed(1) : 'N/A';

            card.innerHTML = `
                <img src="${manga.images.webp.large_image_url}" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="${manga.title}">
                <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div class="absolute top-4 right-4 z-10">
                    <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 text-white font-bold text-xs backdrop-blur-md border border-white/10 shadow-sm">
                        ★ ${score}
                    </span>
                </div>

                <div class="absolute inset-0 p-5 flex flex-col justify-end">
                    <div class="transform transition-transform duration-300 group-hover:-translate-y-2 translate-y-4">
                        <span class="inline-block px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold text-xs backdrop-blur-sm mb-2">
                            ${primaryGenre}
                        </span>
                        <h3 class="text-white text-lg font-bold leading-tight mb-2 line-clamp-2 drop-shadow-md">${manga.title}</h3>
                        <p class="text-gray-300 text-xs line-clamp-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 leading-relaxed">${allGenres}</p>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });

        updateMangaPaginationControls(data.pagination.current_page, data.pagination.has_next_page);

    } catch (error) {
        console.error('Error loading manga:', error);
        grid.innerHTML = '<div class="text-red-500 col-span-full text-center py-20 font-medium">Error loading data.</div>';
    }
}

function updateMangaPaginationControls(currentPage, hasNextPage) {
    currentMangaPage = currentPage;
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const pageIndicator = document.getElementById('page-indicator');

    if (pageIndicator) pageIndicator.textContent = currentPage;
    if (prevBtn) prevBtn.disabled = currentPage <= 1;
    if (nextBtn) nextBtn.disabled = !hasNextPage;
}

// Lancement des écouteurs pour mangas.html
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('manga-grid')) {
        loadAllMangas(currentMangaPage, currentMangaSearchQuery);

        const searchBtn = document.getElementById('search-btn');
        const searchInput = document.getElementById('search-input');
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');

        const performSearch = () => {
            currentMangaSearchQuery = searchInput.value.trim();
            loadAllMangas(1, currentMangaSearchQuery);
        };

        if (searchBtn && searchInput) {
            searchBtn.addEventListener('click', performSearch);
            searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') performSearch(); });
        }

        if (prevBtn) prevBtn.addEventListener('click', () => { if (currentMangaPage > 1) loadAllMangas(currentMangaPage - 1, currentMangaSearchQuery); });
        if (nextBtn) nextBtn.addEventListener('click', () => loadAllMangas(currentMangaPage + 1, currentMangaSearchQuery));
    }
});

// --- Logique de la page de détails (details.html) ---

async function loadDetails() {
    const container = document.getElementById('detail-content');
    if (!container) return;

    container.innerHTML = `
        <div class="flex flex-col items-center justify-center text-gray-500 py-40">
            <span class="relative flex h-12 w-12 mb-4">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00C896] opacity-75"></span>
                <span class="relative inline-flex rounded-full h-12 w-12 bg-[#00C896]"></span>
            </span>
        Loading details...
        </div>
    `;

    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');
    const id = params.get('id');

    if (!type || !id || (type !== 'anime' && type !== 'manga')) {
        container.innerHTML = `<div class="text-red-500 text-center py-40">Error: Invalid type or ID in the URL.</div>`;
        return;
    }

    try {
        const response = await fetch(`https://api.jikan.moe/v4/${type}/${id}`);
        if (response.status === 429) {
            container.innerHTML = '<div class="text-center text-orange-500 py-40 font-medium">Too many API requests. Please wait a moment and try again.</div>';
            return;
        }
        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }
        const { data } = await response.json();

        renderDetailView(container, data, type);

    } catch (error) {
        console.error('Error loading details:', error);
        container.innerHTML = `<div class="text-red-500 text-center py-40">Failed to load details. Please try again later.</div>`;
    }
}

function renderDetailView(container, item, type) {
    const title = item.title_english || item.title;
    const originalTitle = item.title_japanese;
    const imageUrl = item.images.webp.large_image_url;
    const synopsis = item.synopsis ? item.synopsis.replace(/\n/g, '<br>') : 'No synopsis available.';
    
    const score = item.score ? item.score.toFixed(1) : 'N/A';
    const rank = item.rank ? `#${item.rank}` : 'N/A';
    const popularity = item.popularity ? `#${item.popularity}` : 'N/A';
    
    const genres = item.genres.map(g => `<a href="#" class="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-sm text-gray-300 hover:bg-white/20 hover:text-white transition-colors">${g.name}</a>`).join('');
    const themes = item.themes.map(t => `<a href="#" class="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-sm text-gray-300 hover:bg-white/20 hover:text-white transition-colors">${t.name}</a>`).join('');
    
    let typeSpecificInfo;
    if (type === 'anime') {
        typeSpecificInfo = `
            <li class="flex justify-between py-2 border-b border-white/10"><span>Type:</span> <span class="font-semibold">${item.type || 'N/A'}</span></li>
            <li class="flex justify-between py-2 border-b border-white/10"><span>Episodes:</span> <span class="font-semibold">${item.episodes || 'N/A'}</span></li>
            <li class="flex justify-between py-2 border-b border-white/10"><span>Status:</span> <span class="font-semibold">${item.status || 'N/A'}</span></li>
            <li class="flex justify-between py-2 border-b border-white/10"><span>Aired:</span> <span class="font-semibold text-right">${item.aired?.string || 'N/A'}</span></li>
            <li class="flex justify-between py-2"><span>Studio:</span> <span class="font-semibold">${item.studios[0]?.name || 'N/A'}</span></li>
        `;
    } else { // manga
        typeSpecificInfo = `
            <li class="flex justify-between py-2 border-b border-white/10"><span>Type:</span> <span class="font-semibold">${item.type || 'N/A'}</span></li>
            <li class="flex justify-between py-2 border-b border-white/10"><span>Volumes:</span> <span class="font-semibold">${item.volumes || 'N/A'}</span></li>
            <li class="flex justify-between py-2 border-b border-white/10"><span>Chapitres:</span> <span class="font-semibold">${item.chapters || 'N/A'}</span></li>
            <li class="flex justify-between py-2 border-b border-white/10"><span>Status:</span> <span class="font-semibold">${item.status || 'N/A'}</span></li>
            <li class="flex justify-between py-2"><span>Published:</span> <span class="font-semibold text-right">${item.published?.string || 'N/A'}</span></li>
        `;
    }

    const detailHtml = `
    <div class="flex flex-col lg:flex-row gap-8 md:gap-12 text-white">
        <!-- Colonne de gauche : Image & Infos -->
        <div class="w-full lg:w-1/3 shrink-0">
            <img src="${imageUrl}" alt="${title}" class="w-full rounded-2xl shadow-2xl shadow-black/50 mb-6">
            <div class="bg-white/5 border border-white/10 rounded-2xl p-4 text-sm">
                <h3 class="font-bold text-lg mb-3 text-white">Information</h3>
                <ul>${typeSpecificInfo}</ul>
            </div>
        </div>

        <!-- Colonne de droite : Titres, Synopsis, etc. -->
        <div class="w-full lg:w-2/3">
            <span class="text-sm font-semibold tracking-widest uppercase text-[#00C896]">${type}</span>
            <h1 class="text-4xl md:text-5xl font-bold tracking-tight text-white mt-2">${title}</h1>
            <h2 class="text-lg text-gray-400 font-medium mt-1">${originalTitle}</h2>

            <!-- Badges Score / Rang / Popularité -->
            <div class="flex flex-wrap items-center gap-4 mt-6">
                <div class="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                    <span class="text-2xl font-bold text-yellow-400">★ ${score}</span>
                    <span class="text-xs text-yellow-300/80 mt-1">Score</span>
                </div>
                <div class="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg border border-white/20">
                    <span class="text-2xl font-bold text-white">${rank}</span>
                    <span class="text-xs text-gray-300 mt-1">Rank</span>
                </div>
                <div class="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg border border-white/20">
                    <span class="text-2xl font-bold text-white">${popularity}</span>
                    <span class="text-xs text-gray-300 mt-1">Popularity</span>
                </div>
            </div>

            <!-- Synopsis -->
            <div class="mt-8">
                <h3 class="text-2xl font-bold mb-3 text-white">Synopsis</h3>
                <p class="text-gray-300 leading-relaxed text-base">${synopsis}</p>
            </div>

            ${(genres || themes) ? `
            <div class="mt-8 space-y-5">
                ${genres ? `<div><h3 class="text-xl font-bold mb-3 text-white">Genres</h3><div class="flex flex-wrap gap-2">${genres}</div></div>` : ''}
                ${themes ? `<div><h3 class="text-xl font-bold mb-3 text-white">Themes</h3><div class="flex flex-wrap gap-2">${themes}</div></div>` : ''}
            </div>` : ''}
        </div>
    </div>`;
    container.innerHTML = detailHtml;
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('detail-content')) {
        loadDetails();
    }
});