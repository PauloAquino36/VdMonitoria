// /scripts/home.js

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Verificação de Login
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser) {
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = 'login.html';
        return;
    }

    // 2. Elementos do DOM
    const searchButton = document.querySelector('.search-box button');
    const searchInput = document.querySelector('.search-box input');
    const resultsContainer = document.querySelector('.results');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const modalOverlay = document.getElementById('monitoria-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    // 3. Carregar o banco de dados
    const db = await fetch('./db.json').then(res => res.json());
    let allMonitorias = [];
    db.forEach(user => {
        user.monitoriasAtuais.forEach(monitoria => {
            allMonitorias.push({ ...monitoria, tutor: user.nomeCompleto, curso: user.curso, userId: user.id });
        });
    });

    // 4. Lógica de Filtros
    let activeFilters = {}; // Ex: { modalidade: 'Online' }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filterType = button.dataset.filter;
            const filterValue = button.dataset.value;

            // Desativa outros botões do mesmo tipo de filtro
            document.querySelectorAll(`.filter-btn[data-filter="${filterType}"]`).forEach(btn => {
                if (btn !== button) btn.classList.remove('active');
            });
            
            // Ativa/desativa o botão clicado
            button.classList.toggle('active');

            if (button.classList.contains('active')) {
                activeFilters[filterType] = filterValue;
            } else {
                delete activeFilters[filterType];
            }

            performSearch(); // Realiza a busca com os novos filtros
        });
    });

    // 5. Função de Busca e Renderização
    function performSearch() {
        const query = searchInput.value.toLowerCase().trim();
        
        let filteredResults = allMonitorias.filter(monitoria => {
            // Filtro por texto de busca (matéria)
            const matchesQuery = query ? monitoria.materia.toLowerCase().includes(query) : true;
            
            // Filtro pelas opções ativas
            const matchesFilters = Object.entries(activeFilters).every(([key, value]) => {
                return monitoria[key] && monitoria[key].toLowerCase() === value.toLowerCase();
            });

            return matchesQuery && matchesFilters;
        });

        renderResults(filteredResults);
    }

    function renderResults(results) {
        resultsContainer.innerHTML = '';
        if (results.length === 0) {
            resultsContainer.innerHTML = '<p style="text-align: center; color: #555;">Nenhuma monitoria encontrada com estes critérios.</p>';
            return;
        }

        results.forEach(monitoria => {
            const avgScore = monitoria.scores.numeroAvaliacoes > 0 ? monitoria.scores.totalAvaliacoes / monitoria.scores.numeroAvaliacoes : 0;
            const card = document.createElement('div');
            card.className = 'result-card';
            // Adiciona data attributes para identificar a monitoria
            card.dataset.monitoriaId = monitoria.idMonitoria;
            
            card.innerHTML = `
                <div>
                    <h3>${monitoria.materia}</h3>
                    <p style="margin: 5px 0 0; color: #555;">Tutor(a): ${monitoria.tutor}</p>
                </div>
                <div class="stars">${renderStars(avgScore)}</div>
            `;
            resultsContainer.appendChild(card);
        });
    }

    function renderStars(score) {
        let starsHtml = '';
        const fullStars = Math.round(score);
        for (let i = 0; i < 5; i++) {
            starsHtml += `<svg viewBox="0 0 24 24" class="${i < fullStars ? '' : 'empty'}"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.7L5.82 21z"/></svg>`;
        }
        return starsHtml;
    }

    // 6. Lógica do Modal
    resultsContainer.addEventListener('click', (event) => {
        const card = event.target.closest('.result-card');
        if (card) {
            const monitoriaId = parseInt(card.dataset.monitoriaId, 10);
            const monitoriaData = allMonitorias.find(m => m.idMonitoria === monitoriaId);
            if (monitoriaData) {
                openModal(monitoriaData);
            }
        }
    });

    function openModal(monitoria) {
        document.getElementById('modal-materia').textContent = monitoria.materia;
        document.getElementById('modal-tutor').textContent = monitoria.tutor;
        document.getElementById('modal-curso').textContent = monitoria.curso;
        document.getElementById('modal-horario').textContent = monitoria.horario;
        document.getElementById('modal-modalidade').textContent = monitoria.modalidade;
        document.getElementById('modal-valor').textContent = monitoria.valorHora.toFixed(2).replace('.', ',');
        modalOverlay.classList.add('visible');
    }

    function closeModal() {
        modalOverlay.classList.remove('visible');
    }

    modalCloseBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) { // Fecha o modal se clicar fora do conteúdo
            closeModal();
        }
    });

    // 7. Event Listeners da Busca
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', (event) => {
        if (event.key !== 'Enter') {
            performSearch(); // Busca dinâmica enquanto digita
        }
    });

    // Busca inicial para popular a página
    performSearch();
});