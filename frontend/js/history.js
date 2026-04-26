import { apiCall, showToast, formatDate, downloadPDF } from './utils.js';

export async function loadHistory() {
    try {
        const response = await apiCall('/plan/plans');
        if (response.success) {
            renderHistory(response.plans);
        }
    } catch (error) {
        showToast('Erreur lors du chargement de l\'historique', 'error');
    }
}

export function renderHistory(plans) {
    const page = document.getElementById('history-page');

    if (!plans || plans.length === 0) {
        page.innerHTML = `
            <div class="section">
                <h2 class="section-title">Historique des Plans</h2>
                <div class="card">
                    <div class="card-body" style="text-align: center; padding: 3rem;">
                        <p style="font-size: 3rem; margin-bottom: 1rem;">📚</p>
                        <p style="color: var(--text-secondary); margin-bottom: 1rem;">Aucun plan généré pour le moment</p>
                        <button class="btn btn-primary" onclick="window.location.hash = '#generator'">
                            Générer votre premier plan
                        </button>
                    </div>
                </div>
            </div>
        `;
        return;
    }

    const plansList = plans.map((plan, index) => `
        <div class="card mb-3 hover-lift cursor-pointer" onclick="openPlanDetail('${plan._id}')" style="cursor: pointer;">
            <div class="card-body">
                <div class="flex-between mb-2">
                    <div>
                        <h4 style="margin: 0;">${plan.title}</h4>
                        <small style="color: var(--text-secondary);">
                            ${capitalizeType(plan.type)} • ${formatDate(plan.createdAt)}
                        </small>
                    </div>
                    <div style="text-align: right;">
                        <span class="badge badge-primary" style="margin-bottom: 0.5rem;">
                            ${plan.difficulty}
                        </span>
                        ${plan.completed ? '<span class="badge badge-success">✓ Complété</span>' : ''}
                    </div>
                </div>
                <div class="flex-between mt-3">
                    <div>${renderStars(plan.rating)}</div>
                    <div class="flex gap-1">
                        <button class="btn btn-secondary btn-small" onclick="event.stopPropagation(); viewPlan('${plan._id}')">Voir</button>
                        <button class="btn btn-secondary btn-small" onclick="event.stopPropagation(); exportPlan('${plan._id}')">PDF</button>
                        <button class="btn btn-danger btn-small" onclick="event.stopPropagation(); deletePlan('${plan._id}')">Supprimer</button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    page.innerHTML = `
        <div class="section">
            <h2 class="section-title">Historique des Plans (${plans.length})</h2>
            <div id="plans-list" style="max-height: 700px; overflow-y: auto;">
                ${plansList}
            </div>
            <div id="plan-detail" style="display: none; margin-top: 2rem;"></div>
        </div>
    `;
}

export async function viewPlan(planId) {
    try {
        const response = await apiCall(`/plan/plans/${planId}`);
        if (response.success) {
            renderPlanDetail(response.plan);
        }
    } catch (error) {
        showToast('Erreur lors du chargement du plan', 'error');
    }
}

export function renderPlanDetail(plan) {
    const detailContainer = document.getElementById('plan-detail');
    detailContainer.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h3>${plan.title}</h3>
                <small>${capitalizeType(plan.type)} • ${formatDate(plan.createdAt)}</small>
            </div>
            <div class="card-body">
                <div style="line-height: 1.8; max-height: 400px; overflow-y: auto; margin-bottom: 1.5rem;">
                    ${plan.content.split('\n').map(line => {
                        if (line.trim() === '') return '<br>';
                        if (line.match(/^#+/)) return `<h4 style="margin-top: 1rem; margin-bottom: 0.5rem;">${line.replace(/^#+\s*/, '')}</h4>`;
                        return `<p>${line}</p>`;
                    }).join('')}
                </div>

                ${plan.feedback ? `
                    <div class="alert alert-info mt-3">
                        <strong>Votre retour:</strong> ${plan.feedback}
                    </div>
                ` : ''}
            </div>
            <div class="card-footer">
                <div class="form-group">
                    <label>Notez ce plan</label>
                    <select id="plan-rating" onchange="ratePlan('${plan._id}', this.value)">
                        <option value="">-- Pas noté --</option>
                        <option value="1" ${plan.rating == 1 ? 'selected' : ''}>1 ⭐</option>
                        <option value="2" ${plan.rating == 2 ? 'selected' : ''}>2 ⭐⭐</option>
                        <option value="3" ${plan.rating == 3 ? 'selected' : ''}>3 ⭐⭐⭐</option>
                        <option value="4" ${plan.rating == 4 ? 'selected' : ''}>4 ⭐⭐⭐⭐</option>
                        <option value="5" ${plan.rating == 5 ? 'selected' : ''}>5 ⭐⭐⭐⭐⭐</option>
                    </select>
                </div>
                <div class="form-group">
                    <label><input type="checkbox" id="plan-completed" ${plan.completed ? 'checked' : ''} onchange="markCompleted('${plan._id}', this.checked)"> Plan complété</label>
                </div>
                <button class="btn btn-primary" onclick="exportPlan('${plan._id}')">📥 Télécharger en PDF</button>
                <button class="btn btn-secondary" onclick="closePlanDetail()">Fermer</button>
            </div>
        </div>
    `;
    detailContainer.style.display = 'block';
    document.getElementById('plans-list').style.display = 'none';
}

export async function ratePlan(planId, rating) {
    if (!rating) return;

    try {
        const response = await apiCall(`/plan/plans/${planId}`, {
            method: 'PUT',
            body: JSON.stringify({ rating: parseInt(rating) })
        });

        if (response.success) {
            showToast('Plan noté', 'success');
        }
    } catch (error) {
        showToast('Erreur lors de la notation', 'error');
    }
}

export async function markCompleted(planId, completed) {
    try {
        const response = await apiCall(`/plan/plans/${planId}`, {
            method: 'PUT',
            body: JSON.stringify({ completed })
        });

        if (response.success) {
            showToast(completed ? 'Plan marqué comme complété' : 'Plan marqué comme en cours', 'success');
        }
    } catch (error) {
        showToast('Erreur lors de la mise à jour', 'error');
    }
}

export function exportPlan(planId) {
    downloadPDF(planId);
}

export async function deletePlan(planId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce plan ?')) {
        return;
    }

    try {
        const response = await apiCall(`/plan/plans/${planId}`, {
            method: 'DELETE'
        });

        if (response.success) {
            showToast('Plan supprimé', 'success');
            loadHistory();
        }
    } catch (error) {
        showToast('Erreur lors de la suppression', 'error');
    }
}

export function openPlanDetail(planId) {
    viewPlan(planId);
}

export function closePlanDetail() {
    document.getElementById('plan-detail').style.display = 'none';
    document.getElementById('plans-list').style.display = 'block';
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

/* ===== Global Functions ===== */
window.loadHistory = loadHistory;
window.viewPlan = viewPlan;
window.ratePlan = ratePlan;
window.markCompleted = markCompleted;
window.exportPlan = exportPlan;
window.deletePlan = deletePlan;
window.openPlanDetail = openPlanDetail;
window.closePlanDetail = closePlanDetail;
