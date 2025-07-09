document.addEventListener('DOMContentLoaded', () => {
    // 1. Autenticação: Verifica se o usuário está logado
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser) {
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = 'login.html';
        return;
    }

    // 2. Seleciona os containers no HTML
    const atuaisContainer = document.getElementById('atuais-container');
    const historicoContainer = document.getElementById('historico-container');
    const mainContainer = document.querySelector('.monitorias-container');


    // 3. Função para criar o card de uma monitoria
    function createMonitoriaCard(monitoria, isHistorico = false) {
        const card = document.createElement('div');
        card.className = 'monitoria-card';
        card.dataset.id = monitoria.idMonitoria; // Adiciona um identificador ao card

        const info = `
            <div class="monitoria-info">
                <h3>${monitoria.materia}</h3>
                <p><strong>Horário:</strong> ${monitoria.horario}</p>
                <p><strong>Modalidade:</strong> ${monitoria.modalidade}</p>
                ${isHistorico ? `<p><strong>Período:</strong> ${monitoria.periodo}</p>` : ''}
            </div>
        `;

        // No histórico, não há botões de edição ou exclusão
        const actions = isHistorico ? '' : `
            <div class="monitoria-actions">
                <button class="action-btn view" title="Visualizar">
                    <svg viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                </button>
                <button class="action-btn edit" title="Editar">
                    <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                </button>
                <button class="action-btn delete" title="Deletar">
                    <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                </button>
            </div>
        `;
        
        card.innerHTML = info + actions;
        return card;
    }

    // 4. Renderiza as monitorias na tela
    function renderMonitorias() {
        // Renderiza monitorias atuais
        if (loggedInUser.monitoriasAtuais && loggedInUser.monitoriasAtuais.length > 0) {
            loggedInUser.monitoriasAtuais.forEach(m => {
                atuaisContainer.appendChild(createMonitoriaCard(m, false));
            });
        } else {
            atuaisContainer.innerHTML += '<p class="empty-message">Você não possui monitorias ativas no momento.</p>';
        }

        // Renderiza histórico de monitorias
        if (loggedInUser.historicoMonitorias && loggedInUser.historicoMonitorias.length > 0) {
            loggedInUser.historicoMonitorias.forEach(m => {
                historicoContainer.appendChild(createMonitoriaCard(m, true));
            });
        } else {
            historicoContainer.innerHTML += '<p class="empty-message">Você não possui monitorias no seu histórico.</p>';
        }
    }
    
    // 5. Adiciona funcionalidade aos botões de ação (usando delegação de eventos)
    mainContainer.addEventListener('click', (event) => {
        const button = event.target.closest('.action-btn');
        if (!button) return; // Sai se o clique não foi em um botão de ação

        const card = button.closest('.monitoria-card');
        const monitoriaId = card.dataset.id;
        
        if (button.classList.contains('view')) {
            alert(`(Simulação) Visualizando detalhes da monitoria ID: ${monitoriaId}.`);
        }
        
        if (button.classList.contains('edit')) {
            alert(`(Simulação) Editando a monitoria ID: ${monitoriaId}.\nEm um app real, isso abriria um formulário de edição.`);
        }
        
        if (button.classList.contains('delete')) {
            if (confirm(`Tem certeza que deseja excluir a monitoria ID: ${monitoriaId}?`)) {
                card.style.transition = 'opacity 0.5s';
                card.style.opacity = '0';
                setTimeout(() => card.remove(), 500);
                alert(`(Simulação) Monitoria ID: ${monitoriaId} excluída com sucesso.`);
            }
        }
    });

    renderMonitorias();
});