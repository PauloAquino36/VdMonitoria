document.addEventListener('DOMContentLoaded', () => {
    // 1. Pega os dados do usuário que foram salvos no login
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    // 2. Se não houver usuário logado, redireciona para a tela de login
    if (!loggedInUser) {
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = 'login.html';
        return;
    }

    // 3. Seleciona os elementos do HTML que vamos preencher
    const profileNameEl = document.getElementById('profile-name');
    const profileEmailEl = document.getElementById('profile-email');
    const profileMatriculaEl = document.getElementById('profile-matricula');
    const profileCursoEl = document.getElementById('profile-curso');

    // 4. Preenche os elementos com os dados do usuário
    if (profileNameEl) {
        profileNameEl.textContent = loggedInUser.nomeCompleto;
    }
    if (profileEmailEl) {
        profileEmailEl.textContent = loggedInUser.email;
    }
    if (profileMatriculaEl) {
        profileMatriculaEl.textContent = loggedInUser.matricula;
    }
    if (profileCursoEl) {
        profileCursoEl.textContent = loggedInUser.curso;
    }

    // --- CÓDIGO NOVO ADICIONADO AQUI ---
    // 5. Adiciona a funcionalidade de logout ao botão "Sair"
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // Exibe uma confirmação antes de sair
            if (confirm('Você tem certeza que deseja sair?')) {
                // Remove os dados do usuário do armazenamento local
                localStorage.removeItem('loggedInUser');
                // Redireciona o usuário para a página de login
                window.location.href = 'login.html';
            }
        });
    }
});