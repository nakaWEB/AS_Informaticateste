const API_URL = 'http://localhost:3000/api';

// Verificar se usuário está logado
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token && !window.location.href.includes('login.html') && !window.location.href.includes('register.html')) {
        window.location.href = 'login.html';
    }
}

// Login
async function login(email, password) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = 'index.html';
        } else {
            throw new Error(data.message || 'Erro ao fazer login');
        }
    } catch (error) {
        alert('Erro: ' + error.message);
        throw error;
    }
}

// Register
async function register(name, email, password) {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = 'index.html';
        } else {
            throw new Error(data.message || 'Erro ao registrar');
        }
    } catch (error) {
        alert('Erro: ' + error.message);
        throw error;
    }
}

// Logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Verificar status do usuário
function checkUserStatus() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    const userInfo = document.getElementById('userInfo');
    const adminLink = document.getElementById('adminLink');

    if (token && user) {
        userInfo.innerHTML = `
            <div class="user-logged-in">
                <p>Olá, ${user.name}!</p>
                <button onclick="logout()" class="btn-logout">
                    <i class="fas fa-sign-out-alt"></i> Sair
                </button>
            </div>
        `;
        
        if (user.role === 'admin') {
            adminLink.style.display = 'block';
        }
    }
}

// Configurar formulários de login/registro
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            try {
                await login(email, password);
            } catch (error) {
                console.error('Erro no login:', error);
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                alert('As senhas não coincidem!');
                return;
            }

            try {
                await register(name, email, password);
            } catch (error) {
                console.error('Erro no registro:', error);
            }
        });
    }
});