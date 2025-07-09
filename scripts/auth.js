// /scripts/auth.js

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login form');
    const cadastroForm = document.querySelector('.cadastro form');

    async function getDbData() {
        try {
            // Ajuste o caminho para buscar a partir da raiz do projeto
            const response = await fetch('./db.json');
            if (!response.ok) {
                throw new Error('Não foi possível carregar o banco de dados.');
            }
            return await response.json();
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const loginInput = loginForm.querySelector('input[type="text"]').value.trim();
            const senhaInput = loginForm.querySelector('input[type="password"]').value.trim();
            const users = await getDbData();

            const user = users.find(u => (u.email === loginInput || u.matricula === loginInput) && u.senha === "senha123"); // Simulação com senha fixa

            if (user) {
                // Salva o usuário logado no armazenamento local do navegador
                localStorage.setItem('loggedInUser', JSON.stringify(user));
                // Redireciona para a tela inicial
                window.location.href = 'home.html';
            } else {
                alert('E-mail/Matrícula ou senha incorretos.');
            }
        });
    }
    
    // A lógica de cadastro permanece a mesma (simulação)
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            alert('Cadastro realizado com sucesso! (Simulação)\nPor favor, faça o login.');
            cadastroForm.reset();
        });
    }
});