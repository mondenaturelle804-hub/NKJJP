import express from 'express';
import Joi from 'joi';
import * as planController from '../controllers/plan.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { validateRequest, validateParams } from '../middlewares/validate.middleware.js';
import rateLimitMiddleware from '../middlewares/rateLimit.middleware.js';

const router = express.Router();

// Middleware: require authentication for all routes
router.use(verifyJWT);

// Validation schemas
const generatePlanSchema = Joi.object({
  type: Joi.string().valid('health', 'fitness', 'nutrition', 'wellness', 'hybrid').required(),
  objectives: Joi.array().items(Joi.string()).min(1).required(),
  constraints: Joi.array().items(Joi.string()).optional(),
  preferences: Joi.object().optional()
});

const updatePlanSchema = Joi.object({
  feedback: Joi.string().optional(),
  rating: Joi.number().min(0).max(5).optional(),
  completed: Joi.boolean().optional()
});

const planIdSchema = Joi.object({
  planId: Joi.string().required()
});

// Routes
router.post('/generate', rateLimitMiddleware, validateRequest(generatePlanSchema), planController.generateNewPlan);
router.get('/plans', planController.getAllPlans);
router.get('/plans/:planId', validateParams(planIdSchema), planController.getPlanById);
router.put('/plans/:planId', validateParams(planIdSchema), validateRequest(updatePlanSchema), planController.updatePlan);
router.delete('/plans/:planId', validateParams(planIdSchema), planController.deletePlan);
router.get('/plans/:planId/export-pdf', validateParams(planIdSchema), planController.exportPlanPDF);

export default router;
