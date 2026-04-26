import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email requis'],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide']
    },
    password: {
      type: String,
      required: [true, 'Mot de passe requis'],
      minlength: 6,
      select: false
    },
    firstName: {
      type: String,
      default: ''
    },
    lastName: {
      type: String,
      default: ''
    },
    age: {
      type: Number
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      default: 'other'
    },
    weight: {
      type: Number
    },
    height: {
      type: Number
    },
    activityLevel: {
      type: String,
      enum: ['sedentary', 'lightly_active', 'moderately_active', 'very_active'],
      default: 'moderately_active'
    },
    goals: {
      type: [String],
      default: []
    },
    restrictions: {
      type: [String],
      default: []
    },
    preferences: {
      type: Object,
      default: {}
    },
    refreshTokens: [
      {
        token: String,
        createdAt: {
          type: Date,
          expires: 604800
        }
      }
    ]
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcryptjs.compare(candidatePassword, this.password);
};

export const User = mongoose.model('User', userSchema);
export default User;
