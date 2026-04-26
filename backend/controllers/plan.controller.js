import Plan from '../models/Plan.js';
import User from '../models/User.js';
import { generatePlan, validatePlanRequest } from '../services/ai.service.js';
import { generatePlanPDF } from '../services/pdf.service.js';

export const generateNewPlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, objectives, constraints, preferences } = req.body;

    // Validate input
    validatePlanRequest({ type, objectives, constraints, preferences });

    // Get user data
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Generate plan using AI
    const aiResponse = await generatePlan({
      type,
      objectives,
      constraints,
      preferences,
      userData: {
        age: user.age,
        gender: user.gender,
        weight: user.weight,
        height: user.height,
        activityLevel: user.activityLevel
      }
    });

    // Save plan to database
    const plan = new Plan({
      userId,
      type,
      objectives,
      constraints,
      preferences,
      content: aiResponse.content,
      contentJson: {
        objectives,
        constraints,
        preferences
      }
    });

    await plan.save();

    return res.status(201).json({
      success: true,
      message: 'Plan généré et sauvegardé',
      plan: {
        id: plan._id,
        type: plan.type,
        title: plan.title,
        content: plan.content,
        createdAt: plan.createdAt,
        usage: aiResponse.usage
      }
    });
  } catch (error) {
    console.error('Erreur generateNewPlan:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la génération du plan'
    });
  }
};

export const getAllPlans = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const plans = await Plan.find({ userId })
      .select('-content')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Plan.countDocuments({ userId });

    return res.json({
      success: true,
      plans,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erreur getAllPlans:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des plans'
    });
  }
};

export const getPlanById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { planId } = req.params;

    const plan = await Plan.findOne({
      _id: planId,
      userId
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan non trouvé'
      });
    }

    return res.json({
      success: true,
      plan
    });
  } catch (error) {
    console.error('Erreur getPlanById:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du plan'
    });
  }
};

export const updatePlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const { planId } = req.params;
    const { feedback, rating, completed } = req.body;

    const plan = await Plan.findOneAndUpdate(
      { _id: planId, userId },
      {
        feedback,
        rating,
        completed,
        completedAt: completed ? new Date() : null
      },
      { new: true }
    );

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan non trouvé'
      });
    }

    return res.json({
      success: true,
      message: 'Plan mis à jour',
      plan
    });
  } catch (error) {
    console.error('Erreur updatePlan:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du plan'
    });
  }
};

export const deletePlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const { planId } = req.params;

    const plan = await Plan.findOneAndDelete({
      _id: planId,
      userId
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan non trouvé'
      });
    }

    return res.json({
      success: true,
      message: 'Plan supprimé'
    });
  } catch (error) {
    console.error('Erreur deletePlan:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du plan'
    });
  }
};

export const exportPlanPDF = async (req, res) => {
  try {
    const userId = req.user.id;
    const { planId } = req.params;

    const plan = await Plan.findOne({ _id: planId, userId });
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan non trouvé'
      });
    }

    const user = await User.findById(userId);
    const pdfResult = await generatePlanPDF(plan, user);

    return res.download(pdfResult.filepath, `plan_${plan._id}.pdf`, (err) => {
      if (err) {
        console.error('Erreur download PDF:', err);
      }
    });
  } catch (error) {
    console.error('Erreur exportPlanPDF:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'export en PDF'
    });
  }
};

export default {
  generateNewPlan,
  getAllPlans,
  getPlanById,
  updatePlan,
  deletePlan,
  exportPlanPDF
};
