import { apiCall, showToast, validateEmail, validatePassword } from './utils.js';
import { showAuthenticatedUI, showLandingPage } from './app.js';

/* ===== Login Handler ===== */
export async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!validateEmail(email)) {
        showToast('Email invalide', 'error');
        return;
    }

    if (!validatePassword(password)) {
        showToast('Le mot de passe doit contenir au moins 6 caractères', 'error');
        return;
    }

    try {
        const response = await apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        if (response.success) {
            // Store tokens and user info
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);
            localStorage.setItem('user', JSON.stringify(response.user));

            window.appState.isAuthenticated = true;
            window.appState.user = response.user;

            showToast('Connexion réussie!', 'success');
            showAuthenticatedUI();

            // Close modal
            document.getElementById('auth-modal').style.display = 'none';
        }
    } catch (error) {
        showToast(error.message || 'Erreur lors de la connexion', 'error');
    }
}

/* ===== Register Handler ===== */
export async function handleRegister(event) {
    event.preventDefault();

    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const firstName = document.getElementById('register-firstname').value;
    const lastName = document.getElementById('register-lastname').value;

    if (!validateEmail(email)) {
        showToast('Email invalide', 'error');
        return;
    }

    if (!validatePassword(password)) {
        showToast('Le mot de passe doit contenir au moins 6 caractères', 'error');
        return;
    }

    try {
        const response = await apiCall('/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                email,
                password,
                firstName,
                lastName
            })
        });

        if (response.success) {
            // Store tokens and user info
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);
            localStorage.setItem('user', JSON.stringify(response.user));

            window.appState.isAuthenticated = true;
            window.appState.user = response.user;

            showToast('Inscription réussie!', 'success');
            showAuthenticatedUI();

            // Close modal
            document.getElementById('auth-modal').style.display = 'none';
        }
    } catch (error) {
        showToast(error.message || 'Erreur lors de l\'inscription', 'error');
    }
}

/* ===== Logout Handler ===== */
export async function handleLogout() {
    const refreshToken = localStorage.getItem('refreshToken');

    try {
        await apiCall('/auth/logout', {
            method: 'POST',
            body: JSON.stringify({ refreshToken })
        });
    } catch (error) {
        console.error('Logout error:', error);
    }

    // Clear storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    window.appState.isAuthenticated = false;
    window.appState.user = null;

    showToast('Déconnecté', 'info');
    showLandingPage();
}

/* ===== Global Functions ===== */
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.handleLogout = handleLogout;
window.showAuthForm = function(type) {
    const { showAuthForm } = require('./app.js');
    showAuthForm(type);
};
window.switchAuthForm = function(type) {
    const { switchAuthForm } = require('./app.js');
    switchAuthForm(type);
};
window.closeAuthModal = function() {
    const { closeAuthModal } = require('./app.js');
    closeAuthModal();
};
