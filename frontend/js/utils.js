/* ===== API Configuration ===== */
const API_BASE_URL = 'http://localhost:5000/api';

/* ===== HTTP Helpers ===== */
export async function apiCall(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    const token = localStorage.getItem('accessToken');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers
        });

        const data = await response.json();

        if (!response.ok) {
            if (response.status === 401) {
                // Token expired or invalid
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.hash = '';
                showToast('Session expirée. Veuillez vous reconnecter.', 'error');
            }
            throw new Error(data.message || 'Erreur API');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

/* ===== Toast Notifications ===== */
export function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type} animate-slide-in-right`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

/* ===== Form Helpers ===== */
export function getFormData(formId) {
    const form = document.getElementById(formId);
    const formData = new FormData(form);
    return Object.fromEntries(formData);
}

export function setFormData(formId, data) {
    const form = document.getElementById(formId);
    Object.keys(data).forEach(key => {
        const field = form.querySelector(`[name="${key}"]`);
        if (field) {
            field.value = data[key];
        }
    });
}

/* ===== Health Calculations ===== */
export function calculateBMI(weight, height) {
    // weight in kg, height in cm
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
}

export function getBMICategory(bmi) {
    if (bmi < 18.5) return 'Sous-poids';
    if (bmi < 25) return 'Poids normal';
    if (bmi < 30) return 'Surpoids';
    return 'Obésité';
}

export function calculateTDEE(weight, height, age, gender, activityLevel) {
    // Mifflin-St Jeor equation
    let bmr;
    if (gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    const activityMultipliers = {
        sedentary: 1.2,
        lightly_active: 1.375,
        moderately_active: 1.55,
        very_active: 1.725
    };

    const multiplier = activityMultipliers[activityLevel] || 1.55;
    return Math.round(bmr * multiplier);
}

/* ===== Date Helpers ===== */
export function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

export function formatDateTime(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

export function timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'à l\'instant';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `il y a ${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `il y a ${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `il y a ${days}j`;
    return formatDate(dateString);
}

/* ===== String Helpers ===== */
export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function truncate(str, length = 100) {
    if (str.length > length) {
        return str.substring(0, length) + '...';
    }
    return str;
}

export function slugify(str) {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/* ===== PDF Export ===== */
export function downloadPDF(planId) {
    const token = localStorage.getItem('accessToken');
    fetch(`${API_BASE_URL}/plan/plans/${planId}/export-pdf`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.blob())
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `plan_${planId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    })
    .catch(error => {
        console.error('PDF download error:', error);
        showToast('Erreur lors du téléchargement', 'error');
    });
}

/* ===== Validation ===== */
export function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

export function validatePassword(password) {
    return password.length >= 6;
}
