import { showToast } from './utils.js';

/* ===== Global App State ===== */
window.appState = {
    user: null,
    isAuthenticated: false,
    currentPage: 'landing'
};

/* ===== Page Navigation ===== */
export function navigate(page) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');

    switch (page) {
        case 'dashboard':
            showDashboard();
            break;
        case 'generator':
            showGenerator();
            break;
        case 'history':
            showHistory();
            break;
        case 'profile':
            showProfile();
            break;
        default:
            showDashboard();
    }

    window.appState.currentPage = page;
    window.location.hash = page;

    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelector(`[href="#${page}"]`)?.classList.add('active');
}

export function showDashboard() {
    const page = document.getElementById('dashboard-page');
    page.style.display = 'block';
    if (window.loadDashboard) {
        window.loadDashboard();
    }
}

export function showGenerator() {
    const page = document.getElementById('generator-page');
    page.style.display = 'block';
    if (window.loadGenerator) {
        window.loadGenerator();
    }
}

export function showHistory() {
    const page = document.getElementById('history-page');
    page.style.display = 'block';
    if (window.loadHistory) {
        window.loadHistory();
    }
}

export function showProfile() {
    const page = document.getElementById('profile-page');
    page.style.display = 'block';
    if (window.loadProfile) {
        window.loadProfile();
    }
}

/* ===== Auth Status Check ===== */
export function checkAuthStatus() {
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');

    if (token && user) {
        window.appState.isAuthenticated = true;
        window.appState.user = JSON.parse(user);
        showAuthenticatedUI();
        return true;
    } else {
        window.appState.isAuthenticated = false;
        window.appState.user = null;
        showLandingPage();
        return false;
    }
}

export function showAuthenticatedUI() {
    document.getElementById('landing-page').style.display = 'none';
    document.getElementById('main-app').style.display = 'flex';

    const user = window.appState.user;
    const userName = document.getElementById('user-name');
    if (userName) {
        userName.textContent = `${user.firstName || user.email}`;
    }

    // Navigate to dashboard
    navigate('dashboard');
}

export function showLandingPage() {
    document.getElementById('landing-page').style.display = 'flex';
    document.getElementById('main-app').style.display = 'none';
    document.getElementById('auth-modal').style.display = 'none';
}

/* ===== App Initialization ===== */
export function initApp() {
    // Check URL hash for page navigation
    const hash = window.location.hash.slice(1);

    if (checkAuthStatus()) {
        if (hash) {
            navigate(hash);
        } else {
            navigate('dashboard');
        }
    }

    // Handle hash changes
    window.addEventListener('hashchange', () => {
        if (window.appState.isAuthenticated) {
            const hash = window.location.hash.slice(1);
            if (hash) {
                navigate(hash);
            }
        }
    });
}

/* ===== Auth Modal ===== */
export function showAuthForm(type) {
    const modal = document.getElementById('auth-modal');
    modal.style.display = 'flex';
    switchAuthForm(type);
}

export function switchAuthForm(type) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (type === 'login') {
        loginForm.classList.add('show');
        registerForm.classList.remove('show');
    } else {
        loginForm.classList.remove('show');
        registerForm.classList.add('show');
    }
}

export function closeAuthModal() {
    document.getElementById('auth-modal').style.display = 'none';
}

/* ===== Initialize ===== */
document.addEventListener('DOMContentLoaded', initApp);
