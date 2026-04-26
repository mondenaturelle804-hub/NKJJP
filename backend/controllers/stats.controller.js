import Plan from '../models/Plan.js';
import User from '../models/User.js';

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Get plans count
    const totalPlans = await Plan.countDocuments({ userId });
    const completedPlans = await Plan.countDocuments({ userId, completed: true });

    // Get plans by type
    const plansByType = await Plan.aggregate([
      { $match: { userId: user._id } },
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    // Get recent plans
    const recentPlans = await Plan.find({ userId })
      .select('title type createdAt rating')
      .sort({ createdAt: -1 })
      .limit(5);

    // Calculate average rating
    const ratedPlans = await Plan.find({ userId, rating: { $ne: null } });
    const averageRating = ratedPlans.length > 0
      ? (ratedPlans.reduce((sum, plan) => sum + plan.rating, 0) / ratedPlans.length).toFixed(1)
      : 0;

    // Get monthly stats
    const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const monthlyPlans = await Plan.countDocuments({
      userId,
      createdAt: { $gte: oneMonthAgo }
    });

    return res.json({
      success: true,
      stats: {
        totalPlans,
        completedPlans,
        completionRate: totalPlans > 0 ? ((completedPlans / totalPlans) * 100).toFixed(1) : 0,
        plansByType: plansByType.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        averageRating,
        monthlyPlans,
        recentPlans
      },
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        joinedDate: user.createdAt
      }
    });
  } catch (error) {
    console.error('Erreur getDashboardStats:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques'
    });
  }
};

export const getPlansChart = async (req, res) => {
  try {
    const userId = req.user.id;

    const monthlyData = await Plan.aggregate([
      { $match: { userId: require('mongoose').Types.ObjectId(userId) } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    return res.json({
      success: true,
      chartData: monthlyData
    });
  } catch (error) {
    console.error('Erreur getPlansChart:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des données du graphique'
    });
  }
};

export default {
  getDashboardStats,
  getPlansChart
};
