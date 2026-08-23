import express, { type Request, type Response }  from 'express';
import { BudgetController } from '../controllers/BudgetController.ts'
import { router as costRoutes } from './costRoutes.ts'

export const router: express.Router = express.Router();

const controller: BudgetController = new BudgetController();

// GET all budgets
router.get('/', controller.all);

// GET budget by ID page
router.get('/:budgetId', controller.read);

// POST create budget
router.post('/', controller.create);

// PUT update budget by ID
router.put('/:budgetId', controller.update);

// DELETE budget by ID
router.delete('/:budgetId', controller.destroy);

// Nested cost routes for a specific budget
router.use('/:budgetId/costs', costRoutes);