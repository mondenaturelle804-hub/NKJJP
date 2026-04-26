import { apiCall, showToast, calculateBMI, getBMICategory, calculateTDEE } from './utils.js';

export async function loadProfile() {
    try {
        const response = await apiCall('/user/me');
        if (response.success) {
            renderProfile(response.user, response.profile);
        }
    } catch (error) {
        showToast('Erreur lors du chargement du profil', 'error');
    }
}

export function renderProfile(user, profile) {
    const page = document.getElementById('profile-page');

    let bmi = '';
    let tdee = '';
    if (user.weight && user.height) {
        bmi = calculateBMI(user.weight, user.height);
    }
    if (user.weight && user.height && user.age) {
        tdee = calculateTDEE(user.weight, user.height, user.age, user.gender, user.activityLevel);
    }

    page.innerHTML = `
        <div class="section">
            <h2 class="section-title">Mon Profil</h2>

            <!-- Tabs -->
            <div class="tabs">
                <button class="tab-button active" onclick="switchTab('personal')">Informations Personnelles</button>
                <button class="tab-button" onclick="switchTab('health')">Santé & Fitness</button>
                <button class="tab-button" onclick="switchTab('preferences')">Préférences</button>
            </div>

            <!-- Tab 1: Personal Info -->
            <div id="tab-personal" class="tab-content show">
                <div class="card">
                    <div class="card-body">
                        <form id="personal-form" onsubmit="updateProfile(event)">
                            <div class="form-group">
                                <label for="firstName">Prénom</label>
                                <input type="text" id="firstName" name="firstName" value="${user.firstName || ''}" required>
                            </div>
                            <div class="form-group">
                                <label for="lastName">Nom</label>
                                <input type="text" id="lastName" name="lastName" value="${user.lastName || ''}" required>
                            </div>
                            <div class="form-group">
                                <label for="email">Email</label>
                                <input type="email" id="email" name="email" value="${user.email || ''}" disabled>
                            </div>
                            <div class="form-group">
                                <label for="age">Âge</label>
                                <input type="number" id="age" name="age" value="${user.age || ''}" min="1" max="150">
                            </div>
                            <div class="form-group">
                                <label for="gender">Genre</label>
                                <select id="gender" name="gender">
                                    <option value="other" ${user.gender === 'other' ? 'selected' : ''}>Autre</option>
                                    <option value="male" ${user.gender === 'male' ? 'selected' : ''}>Homme</option>
                                    <option value="female" ${user.gender === 'female' ? 'selected' : ''}>Femme</option>
                                </select>
                            </div>
                            <button type="submit" class="btn btn-primary">Mettre à jour</button>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Tab 2: Health & Fitness -->
            <div id="tab-health" class="tab-content">
                <div class="card mb-4">
                    <div class="card-header">
                        <h3>Mesures</h3>
                    </div>
                    <div class="card-body">
                        <form id="health-form" onsubmit="updateProfile(event)">
                            <div class="grid grid-2">
                                <div class="form-group">
                                    <label for="weight">Poids (kg)</label>
                                    <input type="number" id="weight" name="weight" value="${user.weight || ''}" min="0" step="0.1">
                                </div>
                                <div class="form-group">
                                    <label for="height">Taille (cm)</label>
                                    <input type="number" id="height" name="height" value="${user.height || ''}" min="0" step="0.1">
                                </div>
                            </div>

                            ${bmi ? `
                                <div class="alert alert-info">
                                    <strong>IMC:</strong> ${bmi} (${getBMICategory(bmi)})
                                </div>
                            ` : ''}

                            <div class="form-group">
                                <label for="activityLevel">Niveau d'activité</label>
                                <select id="activityLevel" name="activityLevel">
                                    <option value="sedentary" ${user.activityLevel === 'sedentary' ? 'selected' : ''}>Sédentaire</option>
                                    <option value="lightly_active" ${user.activityLevel === 'lightly_active' ? 'selected' : ''}>Peu actif</option>
                                    <option value="moderately_active" ${user.activityLevel === 'moderately_active' ? 'selected' : ''}>Modérément actif</option>
                                    <option value="very_active" ${user.activityLevel === 'very_active' ? 'selected' : ''}>Très actif</option>
                                </select>
                            </div>

                            ${tdee ? `
                                <div class="alert alert-info">
                                    <strong>TDEE (calories/jour):</strong> ${tdee}
                                </div>
                            ` : ''}

                            <button type="submit" class="btn btn-primary">Mettre à jour</button>
                        </form>
                    </div>
                </div>

                <!-- Goals & Restrictions -->
                <div class="card">
                    <div class="card-header">
                        <h3>Objectifs & Restrictions</h3>
                    </div>
                    <div class="card-body">
                        <form id="goals-form">
                            <div class="form-group">
                                <label>Objectifs</label>
                                <div>
                                    <label><input type="checkbox" name="goals" value="lose_weight" ${user.goals?.includes('lose_weight') ? 'checked' : ''}> Perdre du poids</label>
                                    <label><input type="checkbox" name="goals" value="gain_muscle" ${user.goals?.includes('gain_muscle') ? 'checked' : ''}> Gagner du muscle</label>
                                    <label><input type="checkbox" name="goals" value="improve_stamina" ${user.goals?.includes('improve_stamina') ? 'checked' : ''}> Améliorer l'endurance</label>
                                    <label><input type="checkbox" name="goals" value="better_health" ${user.goals?.includes('better_health') ? 'checked' : ''}> Meilleure santé</label>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Restrictions</label>
                                <div>
                                    <label><input type="checkbox" name="restrictions" value="no_gluten" ${user.restrictions?.includes('no_gluten') ? 'checked' : ''}> Sans gluten</label>
                                    <label><input type="checkbox" name="restrictions" value="no_dairy" ${user.restrictions?.includes('no_dairy') ? 'checked' : ''}> Sans produits laitiers</label>
                                    <label><input type="checkbox" name="restrictions" value="vegetarian" ${user.restrictions?.includes('vegetarian') ? 'checked' : ''}> Végétarien</label>
                                    <label><input type="checkbox" name="restrictions" value="vegan" ${user.restrictions?.includes('vegan') ? 'checked' : ''}> Végan</label>
                                </div>
                            </div>
                            <button type="button" class="btn btn-primary" onclick="saveGoalsRestrictions()">Mettre à jour</button>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Tab 3: Preferences -->
            <div id="tab-preferences" class="tab-content">
                <div class="card">
                    <div class="card-header">
                        <h3>Préférences</h3>
                    </div>
                    <div class="card-body">
                        <div class="alert alert-warning">
                            <strong>Zone de Danger</strong> - Gérez vos données personnelles
                        </div>
                        <button class="btn btn-danger mt-3" onclick="deleteAccount()">
                            🗑️ Supprimer mon compte
                        </button>
                        <p class="text-secondary mt-2" style="font-size: 0.9rem;">
                            Cette action est irréversible. Tous vos données seront supprimées.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <script>
            function switchTab(tab) {
                document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('show'));
                document.querySelectorAll('.tab-button').forEach(el => el.classList.remove('active'));

                document.getElementById('tab-' + tab).classList.add('show');
                event.target.classList.add('active');
            }
        </script>
    `;
}

export async function updateProfile(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    try {
        const response = await apiCall('/user/profile', {
            method: 'PUT',
            body: JSON.stringify(data)
        });

        if (response.success) {
            localStorage.setItem('user', JSON.stringify(response.user));
            showToast('Profil mis à jour', 'success');
        }
    } catch (error) {
        showToast('Erreur lors de la mise à jour', 'error');
    }
}

export async function saveGoalsRestrictions() {
    const goalsCheckboxes = document.querySelectorAll('input[name="goals"]:checked');
    const restrictionsCheckboxes = document.querySelectorAll('input[name="restrictions"]:checked');

    const goals = Array.from(goalsCheckboxes).map(cb => cb.value);
    const restrictions = Array.from(restrictionsCheckboxes).map(cb => cb.value);

    try {
        const response = await apiCall('/user/profile', {
            method: 'PUT',
            body: JSON.stringify({ goals, restrictions })
        });

        if (response.success) {
            localStorage.setItem('user', JSON.stringify(response.user));
            showToast('Objectifs et restrictions mis à jour', 'success');
        }
    } catch (error) {
        showToast('Erreur lors de la mise à jour', 'error');
    }
}

export async function deleteAccount() {
    if (!confirm('Êtes-vous vraiment sûr ? Cette action est irréversible.')) {
        return;
    }

    if (!confirm('Tous vos données seront supprimées définitivement. Êtes-vous certain ?')) {
        return;
    }

    try {
        const response = await apiCall('/user/account', {
            method: 'DELETE'
        });

        if (response.success) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');

            showToast('Compte supprimé', 'success');
            window.location.hash = '';
            window.location.reload();
        }
    } catch (error) {
        showToast('Erreur lors de la suppression', 'error');
    }
}

/* ===== Global Functions ===== */
window.loadProfile = loadProfile;
window.updateProfile = updateProfile;
window.saveGoalsRestrictions = saveGoalsRestrictions;
window.deleteAccount = deleteAccount;
window.switchTab = function(tab) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('show'));
    document.querySelectorAll('.tab-button').forEach(el => el.classList.remove('active'));

    document.getElementById('tab-' + tab).classList.add('show');
    event.target.classList.add('active');
};
