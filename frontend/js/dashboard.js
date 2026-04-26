import { apiCall, showToast } from './utils.js';

export async function loadDashboard() {
    try {
        const response = await apiCall('/stats/dashboard');
        if (response.success) {
            renderDashboard(response.stats, response.user);
        }
    } catch (error) {
        showToast('Erreur lors du chargement du tableau de bord', 'error');
    }
}

export function renderDashboard(stats, user) {
    const page = document.getElementById('dashboard-page');
    page.innerHTML = `
        <div class="section">
            <h2 class="section-title">Bienvenue, ${user.firstName || 'Utilisateur'}! 👋</h2>

            <!-- Quick Stats -->
            <div class="grid grid-4 mb-4">
                <div class="stats-box">
                    <div class="stats-value">${stats.totalPlans}</div>
                    <div class="stats-label">Plans générés</div>
                </div>
                <div class="stats-box">
                    <div class="stats-value">${stats.completedPlans}</div>
                    <div class="stats-label">Plans complétés</div>
                </div>
                <div class="stats-box">
                    <div class="stats-value">${stats.completionRate}%</div>
                    <div class="stats-label">Taux de complétion</div>
                </div>
                <div class="stats-box">
                    <div class="stats-value">${stats.averageRating}</div>
                    <div class="stats-label">Note moyenne ⭐</div>
                </div>
            </div>

            <!-- Charts Section -->
            <div class="grid grid-2 mb-4">
                <!-- Plans by Type -->
                <div class="card">
                    <div class="card-header">
                        <h3>Plans par Type</h3>
                    </div>
                    <div class="card-body">
                        ${renderPlansByType(stats.plansByType)}
                    </div>
                </div>

                <!-- Monthly Activity -->
                <div class="card">
                    <div class="card-header">
                        <h3>Activité du Mois</h3>
                    </div>
                    <div class="card-body">
                        <div style="text-align: center;">
                            <div style="font-size: 2.5rem; color: var(--primary-color); font-weight: bold;">
                                ${stats.monthlyPlans}
                            </div>
                            <p>Plans générés ce mois-ci</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Recent Plans -->
            <div class="card">
                <div class="card-header">
                    <h3>Plans Récents</h3>
                </div>
                <div class="card-body">
                    ${renderRecentPlans(stats.recentPlans)}
                </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-2 mt-4">
                <button class="btn btn-primary" onclick="window.location.hash = '#generator'">
                    ✨ Générer un nouveau plan
                </button>
                <button class="btn btn-secondary" onclick="window.location.hash = '#history'">
                    📚 Voir l'historique complet
                </button>
            </div>
        </div>
    `;
}

export function renderPlansByType(plansByType) {
    if (Object.keys(plansByType).length === 0) {
        return '<p class="text-secondary">Aucun plan généré pour le moment</p>';
    }

    return Object.entries(plansByType).map(([type, count]) => `
        <div class="flex-between py-2 px-2" style="border-bottom: 1px solid var(--border-color);">
            <span>${capitalizeType(type)}</span>
            <span class="badge badge-primary">${count}</span>
        </div>
    `).join('');
}

export function renderRecentPlans(plans) {
    if (!plans || plans.length === 0) {
        return '<p class="text-secondary">Aucun plan récent</p>';
    }

    return plans.map(plan => `
        <div class="flex-between py-2 px-2" style="border-bottom: 1px solid var(--border-color);">
            <div>
                <p style="margin: 0;"><strong>${plan.title}</strong></p>
                <small style="color: var(--text-secondary);">${capitalizeType(plan.type)}</small>
            </div>
            <div style="text-align: right;">
                <div>${renderStars(plan.rating)}</div>
                <small>${formatDate(plan.createdAt)}</small>
            </div>
        </div>
    `).join('');
}

export function capitalizeType(type) {
    const types = {
        health: 'Santé',
        fitness: 'Fitness',
        nutrition: 'Nutrition',
        wellness: 'Bien-être',
        hybrid: 'Hybride'
    };
    return types[type] || type;
}

export function renderStars(rating) {
    if (!rating) return '<span style="color: var(--text-light);">Non noté</span>';
    const stars = Math.round(rating);
    return '⭐'.repeat(stars) + (5 - stars > 0 ? '☆'.repeat(5 - stars) : '');
}

export function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'short'
    }).format(date);
}

/* ===== Global Functions ===== */
window.loadDashboard = loadDashboard;
