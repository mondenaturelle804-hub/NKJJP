import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    bio: {
      type: String,
      default: ''
    },
    avatar: {
      type: String,
      default: 'https://via.placeholder.com/150'
    },
    dateOfBirth: {
      type: Date
    },
    medicalConditions: {
      type: [String],
      default: []
    },
    allergies: {
      type: [String],
      default: []
    },
    medications: {
      type: [String],
      default: []
    },
    exerciseFrequency: {
      type: String,
      enum: ['never', '1-2x_week', '3-4x_week', '5-6x_week', 'daily'],
      default: '3-4x_week'
    },
    dietType: {
      type: String,
      enum: ['omnivore', 'vegetarian', 'vegan', 'keto', 'paleo', 'other'],
      default: 'omnivore'
    },
    timezone: {
      type: String,
      default: 'UTC'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      }
    },
    plansGenerated: {
      type: Number,
      default: 0
    },
    totalPlansViewed: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export const Profile = mongoose.model('Profile', profileSchema);
export default Profile;
