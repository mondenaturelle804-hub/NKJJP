import express from 'express';
import * as statsController from '../controllers/stats.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Middleware: require authentication for all routes
router.use(verifyJWT);

// Routes
router.get('/dashboard', statsController.getDashboardStats);
router.get('/charts/plans', statsController.getPlansChart);

export default router;
