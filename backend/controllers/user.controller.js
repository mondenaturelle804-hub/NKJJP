import User from '../models/User.js';
import Profile from '../models/Profile.js';

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    const profile = await Profile.findOne({ userId });

    return res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        age: user.age,
        gender: user.gender,
        weight: user.weight,
        height: user.height,
        activityLevel: user.activityLevel,
        goals: user.goals,
        restrictions: user.restrictions
      },
      profile: profile || {}
    });
  } catch (error) {
    console.error('Erreur getProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du profil'
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Update or create profile
    let profile = await Profile.findOne({ userId });
    if (!profile) {
      profile = new Profile({ userId });
    }
    await profile.save();

    return res.json({
      success: true,
      message: 'Profil mis à jour',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        age: user.age,
        gender: user.gender,
        weight: user.weight,
        height: user.height,
        activityLevel: user.activityLevel,
        goals: user.goals,
        restrictions: user.restrictions
      }
    });
  } catch (error) {
    console.error('Erreur updateProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du profil'
    });
  }
};

export const updateProfileDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;

    let profile = await Profile.findOne({ userId });
    if (!profile) {
      profile = new Profile({ userId });
    }

    Object.assign(profile, updateData);
    await profile.save();

    return res.json({
      success: true,
      message: 'Détails du profil mis à jour',
      profile
    });
  } catch (error) {
    console.error('Erreur updateProfileDetails:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour des détails'
    });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    await User.findByIdAndDelete(userId);
    await Profile.findOneAndDelete({ userId });

    return res.json({
      success: true,
      message: 'Compte supprimé'
    });
  } catch (error) {
    console.error('Erreur deleteAccount:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du compte'
    });
  }
};

export default {
  getProfile,
  updateProfile,
  updateProfileDetails,
  deleteAccount
};
