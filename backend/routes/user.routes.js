import express from 'express';
import Joi from 'joi';
import * as userController from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';

const router = express.Router();

// Middleware: require authentication for all routes
router.use(verifyJWT);

// Validation schema
const updateProfileSchema = Joi.object({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  age: Joi.number().optional(),
  gender: Joi.string().valid('male', 'female', 'other').optional(),
  weight: Joi.number().optional(),
  height: Joi.number().optional(),
  activityLevel: Joi.string().valid('sedentary', 'lightly_active', 'moderately_active', 'very_active').optional(),
  goals: Joi.array().items(Joi.string()).optional(),
  restrictions: Joi.array().items(Joi.string()).optional()
});

// Routes
router.get('/me', userController.getProfile);
router.put('/profile', validateRequest(updateProfileSchema), userController.updateProfile);
router.put('/profile/details', userController.updateProfileDetails);
router.delete('/account', userController.deleteAccount);

export default router;
