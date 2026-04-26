import mongoose from 'mongoose';

const planSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      default: 'Mon plan personnalisé'
    },
    type: {
      type: String,
      enum: ['health', 'fitness', 'nutrition', 'wellness', 'hybrid'],
      required: true
    },
    objectives: {
      type: [String],
      required: true
    },
    constraints: {
      type: [String],
      default: []
    },
    preferences: {
      type: Object,
      default: {}
    },
    content: {
      type: String,
      required: true
    },
    contentJson: {
      type: Object,
      default: {}
    },
    estimatedDuration: {
      type: String,
      default: '8 weeks'
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate'
    },
    feedback: {
      type: String,
      default: ''
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: null
    },
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: {
      type: Date
    }
  },
  { timestamps: true }
);

export const Plan = mongoose.model('Plan', planSchema);
export default Plan;
