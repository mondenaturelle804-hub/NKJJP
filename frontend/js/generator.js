import { apiCall, showToast } from './utils.js';

let currentStep = 1;
let formData = {};

export function loadGenerator() {
    renderGeneratorForm();
}

export function renderGeneratorForm() {
    const page = document.getElementById('generator-page');
    page.innerHTML = `
        <div class="section">
            <h2 class="section-title">Générer un Plan Personnalisé</h2>

            <div class="card mt-3">
                <div class="card-body">
                    <!-- Step Indicator -->
                    <div class="flex-between mb-4" id="step-indicator">
                        <div class="step-item active" data-step="1">
                            <span class="step-number">1</span>
                            <span class="step-label">Type</span>
                        </div>
                        <div class="step-item" data-step="2">
                            <span class="step-number">2</span>
                            <span class="step-label">Objectifs</span>
                        </div>
                        <div class="step-item" data-step="3">
                            <span class="step-number">3</span>
                            <span class="step-label">Contraintes</span>
                        </div>
                        <div class="step-item" data-step="4">
                            <span class="step-number">4</span>
                            <span class="step-label">Préférences</span>
                        </div>
                        <div class="step-item" data-step="5">
                            <span class="step-number">5</span>
                            <span class="step-label">Résumé</span>
                        </div>
                    </div>

                    <!-- Step 1: Type -->
                    <form id="step-1-form" class="step-form" style="display: block;">
                        <h3 class="mb-3">Quel type de plan voulez-vous ?</h3>
                        <div class="form-group">
                            <label><input type="radio" name="type" value="health"> Plan de santé générale</label>
                            <label><input type="radio" name="type" value="fitness"> Plan d'entraînement</label>
                            <label><input type="radio" name="type" value="nutrition"> Plan nutritionnel</label>
                            <label><input type="radio" name="type" value="wellness"> Plan bien-être</label>
                            <label><input type="radio" name="type" value="hybrid"> Plan hybride</label>
                        </div>
                        <div class="flex-between mt-3">
                            <button type="button" class="btn btn-secondary" onclick="previousStep()" style="display: none;">← Précédent</button>
                            <button type="button" class="btn btn-primary" onclick="nextStep()">Suivant →</button>
                        </div>
                    </form>

                    <!-- Step 2: Objectives -->
                    <form id="step-2-form" class="step-form" style="display: none;">
                        <h3 class="mb-3">Quels sont vos objectifs ?</h3>
                        <div class="form-group">
                            <label><input type="checkbox" name="objectives" value="lose_weight"> Perdre du poids</label>
                            <label><input type="checkbox" name="objectives" value="gain_muscle"> Gagner du muscle</label>
                            <label><input type="checkbox" name="objectives" value="improve_stamina"> Améliorer l'endurance</label>
                            <label><input type="checkbox" name="objectives" value="boost_energy"> Augmenter l'énergie</label>
                            <label><input type="checkbox" name="objectives" value="better_sleep"> Mieux dormir</label>
                            <label><input type="checkbox" name="objectives" value="stress_relief"> Réduire le stress</label>
                        </div>
                        <div class="flex-between mt-3">
                            <button type="button" class="btn btn-secondary" onclick="previousStep()">← Précédent</button>
                            <button type="button" class="btn btn-primary" onclick="nextStep()">Suivant →</button>
                        </div>
                    </form>

                    <!-- Step 3: Constraints -->
                    <form id="step-3-form" class="step-form" style="display: none;">
                        <h3 class="mb-3">Y a-t-il des contraintes ?</h3>
                        <div class="form-group">
                            <label><input type="checkbox" name="constraints" value="injury"> Blessure en cours</label>
                            <label><input type="checkbox" name="constraints" value="no_equipment"> Pas d'équipement</label>
                            <label><input type="checkbox" name="constraints" value="limited_time"> Temps limité</label>
                            <label><input type="checkbox" name="constraints" value="dietary"> Restrictions alimentaires</label>
                            <label><input type="checkbox" name="constraints" value="budget"> Budget limité</label>
                        </div>
                        <div class="flex-between mt-3">
                            <button type="button" class="btn btn-secondary" onclick="previousStep()">← Précédent</button>
                            <button type="button" class="btn btn-primary" onclick="nextStep()">Suivant →</button>
                        </div>
                    </form>

                    <!-- Step 4: Preferences -->
                    <form id="step-4-form" class="step-form" style="display: none;">
                        <h3 class="mb-3">Vos préférences</h3>
                        <div class="form-group">
                            <label for="duration">Durée du plan (semaines)</label>
                            <input type="number" id="duration" name="duration" min="2" max="24" value="8">
                        </div>
                        <div class="form-group">
                            <label for="intensity">Intensité</label>
                            <select id="intensity" name="intensity">
                                <option value="beginner">Débutant</option>
                                <option value="intermediate" selected>Intermédiaire</option>
                                <option value="advanced">Avancé</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="notes">Notes additionnelles</label>
                            <textarea id="notes" name="notes" placeholder="Parlez-nous de vous..."></textarea>
                        </div>
                        <div class="flex-between mt-3">
                            <button type="button" class="btn btn-secondary" onclick="previousStep()">← Précédent</button>
                            <button type="button" class="btn btn-primary" onclick="nextStep()">Suivant →</button>
                        </div>
                    </form>

                    <!-- Step 5: Summary -->
                    <form id="step-5-form" class="step-form" style="display: none;">
                        <h3 class="mb-3">Résumé de votre demande</h3>
                        <div id="summary-content" class="card mb-3"></div>
                        <div class="flex-between mt-3">
                            <button type="button" class="btn btn-secondary" onclick="previousStep()">← Précédent</button>
                            <button type="button" class="btn btn-primary" onclick="generatePlan()" id="generate-btn">Générer le plan ✨</button>
                        </div>
                    </form>

                    <!-- Results -->
                    <div id="result-container" style="display: none;"></div>
                </div>
            </div>
        </div>

        <style>
            .step-indicator {
                display: flex;
                justify-content: space-between;
                margin-bottom: 2rem;
            }
            .step-item {
                flex: 1;
                text-align: center;
                opacity: 0.5;
                transition: all 0.3s ease;
            }
            .step-item.active {
                opacity: 1;
            }
            .step-number {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 40px;
                height: 40px;
                background-color: var(--bg-tertiary);
                border-radius: 50%;
                margin: 0 auto 0.5rem;
                font-weight: 600;
            }
            .step-item.active .step-number {
                background-color: var(--primary-color);
                color: white;
            }
            .step-label {
                display: block;
                font-size: 0.9rem;
                margin-top: 0.5rem;
            }
            .step-form label {
                display: block;
                margin-bottom: 0.75rem;
                cursor: pointer;
            }
            .step-form input[type="checkbox"],
            .step-form input[type="radio"] {
                margin-right: 0.5rem;
            }
        </style>
    `;

    // Add event listeners for form inputs
    document.querySelectorAll('.step-form input, .step-form select, .step-form textarea').forEach(el => {
        el.addEventListener('change', () => saveStepData());
    });
}

export function saveStepData() {
    const currentForm = document.getElementById(`step-${currentStep}-form`);
    const inputs = currentForm.querySelectorAll('input, select, textarea');

    inputs.forEach(input => {
        if (input.type === 'checkbox' && input.name === 'objectives') {
            if (!formData.objectives) formData.objectives = [];
            if (input.checked && !formData.objectives.includes(input.value)) {
                formData.objectives.push(input.value);
            } else if (!input.checked && formData.objectives.includes(input.value)) {
                formData.objectives = formData.objectives.filter(v => v !== input.value);
            }
        } else if (input.type === 'checkbox' && input.name === 'constraints') {
            if (!formData.constraints) formData.constraints = [];
            if (input.checked && !formData.constraints.includes(input.value)) {
                formData.constraints.push(input.value);
            } else if (!input.checked && formData.constraints.includes(input.value)) {
                formData.constraints = formData.constraints.filter(v => v !== input.value);
            }
        } else if (input.type === 'radio') {
            if (input.checked) {
                formData[input.name] = input.value;
            }
        } else {
            formData[input.name] = input.value;
        }
    });
}

export function nextStep() {
    saveStepData();

    // Validate current step
    if (currentStep === 1 && !formData.type) {
        showToast('Veuillez sélectionner un type', 'warning');
        return;
    }
    if (currentStep === 2 && (!formData.objectives || formData.objectives.length === 0)) {
        showToast('Veuillez sélectionner au least un objectif', 'warning');
        return;
    }

    if (currentStep < 5) {
        hidAllSteps();
        currentStep++;
        showCurrentStep();
        updateStepIndicator();

        if (currentStep === 5) {
            updateSummary();
        }
    }
}

export function previousStep() {
    saveStepData();
    if (currentStep > 1) {
        hideAllSteps();
        currentStep--;
        showCurrentStep();
        updateStepIndicator();
    }
}

export function hideAllSteps() {
    document.querySelectorAll('.step-form').forEach(form => form.style.display = 'none');
}

export function showCurrentStep() {
    const form = document.getElementById(`step-${currentStep}-form`);
    if (form) {
        form.style.display = 'block';
    }
}

export function updateStepIndicator() {
    document.querySelectorAll('.step-item').forEach((item, index) => {
        item.classList.toggle('active', index + 1 === currentStep);
    });
}

export function updateSummary() {
    const summary = `
        <div class="card-body">
            <p><strong>Type:</strong> ${formData.type}</p>
            <p><strong>Objectifs:</strong> ${formData.objectives.join(', ')}</p>
            <p><strong>Contraintes:</strong> ${formData.constraints && formData.constraints.length > 0 ? formData.constraints.join(', ') : 'Aucune'}</p>
            <p><strong>Durée:</strong> ${formData.duration} semaines</p>
            <p><strong>Intensité:</strong> ${formData.intensity}</p>
            ${formData.notes ? `<p><strong>Notes:</strong> ${formData.notes}</p>` : ''}
        </div>
    `;
    document.getElementById('summary-content').innerHTML = summary;
}

export async function generatePlan() {
    saveStepData();

    const generateBtn = document.getElementById('generate-btn');
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<span class="spinner"></span> Génération...';

    try {
        const response = await apiCall('/plan/generate', {
            method: 'POST',
            body: JSON.stringify({
                type: formData.type,
                objectives: formData.objectives || [],
                constraints: formData.constraints || [],
                preferences: {
                    duration: formData.duration,
                    intensity: formData.intensity,
                    notes: formData.notes
                }
            })
        });

        if (response.success) {
            showToast('Plan généré avec succès!', 'success');
            displayPlanResult(response.plan);
        }
    } catch (error) {
        showToast(error.message || 'Erreur lors de la génération', 'error');
    } finally {
        generateBtn.disabled = false;
        generateBtn.innerHTML = 'Générer le plan ✨';
    }
}

export function displayPlanResult(plan) {
    const resultContainer = document.getElementById('result-container');
    resultContainer.innerHTML = `
        <div class="section mt-4">
            <h3 class="section-title">Votre Plan Généré</h3>
            <div class="card">
                <div class="card-header">
                    <h4>${plan.title}</h4>
                    <p class="text-secondary"><strong>Type:</strong> ${plan.type} | <strong>Durée:</strong> ${plan.estimatedDuration}</p>
                </div>
                <div class="card-body">
                    <div style="max-height: 400px; overflow-y: auto; line-height: 1.8;">
                        ${plan.content.split('\n').map(line => `<p>${line}</p>`).join('')}
                    </div>
                </div>
                <div class="card-footer">
                    <button class="btn btn-primary" onclick="window.location.hash = '#history'">Voir dans l'historique</button>
                    <button class="btn btn-secondary" onclick="location.reload()">Générer un autre plan</button>
                </div>
            </div>
        </div>
    `;
    resultContainer.style.display = 'block';
    document.getElementById('step-5-form').style.display = 'none';
}

/* ===== Global Functions ===== */
window.loadGenerator = loadGenerator;
window.nextStep = nextStep;
window.previousStep = previousStep;
window.generatePlan = generatePlan;
window.navigate = function(page) {
    const { navigate } = require('./app.js');
    navigate(page);
};
