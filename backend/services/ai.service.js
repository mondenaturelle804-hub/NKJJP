import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

export const generatePlan = async (planRequest) => {
  const {
    type,
    objectives,
    constraints,
    preferences,
    userData
  } = planRequest;

  const prompt = buildPrompt(type, objectives, constraints, preferences, userData);

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const content = message.content[0].type === 'text' ? message.content[0].text : '';
    return {
      success: true,
      content,
      stopReason: message.stop_reason,
      usage: {
        inputTokens: message.usage.input_tokens,
        outputTokens: message.usage.output_tokens
      }
    };
  } catch (error) {
    console.error('Erreur API Anthropic:', error.message);
    throw new Error(`Génération de plan échouée: ${error.message}`);
  }
};

const buildPrompt = (type, objectives, constraints, preferences, userData) => {
  return `Tu es un expert en santé, sport et bien-être. Génère un plan personnalisé détaillé basé sur les paramètres suivants:

TYPE: ${type}
OBJECTIFS: ${objectives.join(', ')}
CONTRAINTES: ${constraints.length > 0 ? constraints.join(', ') : 'Aucune'}
PRÉFÉRENCES: ${JSON.stringify(preferences)}

PROFIL UTILISATEUR:
- Âge: ${userData.age || 'Non spécifié'}
- Genre: ${userData.gender || 'Non spécifié'}
- Poids: ${userData.weight || 'Non spécifié'} kg
- Taille: ${userData.height || 'Non spécifié'} cm
- Niveau d'activité: ${userData.activityLevel || 'Modéré'}

Le plan doit être:
1. Structuré et facile à suivre
2. Réaliste et atteignable
3. Détaillé avec des étapes claires
4. Incluant des métriques de succès
5. Adapté au profil de l'utilisateur

Format la réponse en sections claires avec des en-têtes.`;
};

export const validatePlanRequest = (planRequest) => {
  const { type, objectives } = planRequest;

  if (!type || !['health', 'fitness', 'nutrition', 'wellness', 'hybrid'].includes(type)) {
    throw new Error('Type de plan invalide');
  }

  if (!objectives || !Array.isArray(objectives) || objectives.length === 0) {
    throw new Error('Au moins un objectif est requis');
  }

  return true;
};

export default {
  generatePlan,
  validatePlanRequest
};
