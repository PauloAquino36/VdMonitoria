// /scripts/contratadas.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Autenticação: Verifica se há um usuário logado no localStorage.
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    // Se não houver, exibe um alerta e redireciona para a página de login.
    if (!loggedInUser) {
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = 'login.html';
        return;
    }

    // 2. Seleciona o container no HTML onde os cards serão inseridos.
    const container = document.getElementById('contratadas-container');

    // 3. Função para criar o HTML de um card de monitoria contratada.
    function createContratadaCard(contratada) {
        const card = document.createElement('div');
        card.className = 'contratada-card';
        
        // Formata a data para o padrão brasileiro (dd/mm/yyyy).
        const dataFormatada = new Date(contratada.data).toLocaleDateString('pt-BR');
        
        // Formata o valor para a moeda brasileira (R$ xx,xx).
        const valorFormatado = contratada.valorPago.toFixed(2).replace('.', ',');

        card.innerHTML = `
            <h3>${contratada.materia}</h3>
            <p><strong>Tutor(a):</strong> ${contratada.tutor}</p>
            <p><strong>Data:</strong> ${dataFormatada}</p>
            <p><strong>Valor Pago:</strong> R$ ${valorFormatado}</p>
        `;
        return card;
    }

    // 4. Função principal para renderizar as monitorias na tela.
    function renderContratadas() {
        // Verifica se a propriedade 'monitoriasContratadas' existe e não está vazia.
        if (loggedInUser.monitoriasContratadas && loggedInUser.monitoriasContratadas.length > 0) {
            // Para cada monitoria contratada, cria um card e o adiciona ao container.
            loggedInUser.monitoriasContratadas.forEach(c => {
                container.appendChild(createContratadaCard(c));
            });
        } else {
            // Se não houver monitorias, exibe uma mensagem informativa.
            container.innerHTML = '<p class="empty-message">Você ainda não contratou nenhuma monitoria.</p>';
        }
    }

    // Inicia o processo de renderização.
    renderContratadas();
});