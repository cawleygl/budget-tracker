import express, { type Request, type Response }  from 'express';
import { BudgetController } from '../controllers/BudgetController.ts'
import { router as costRoutes } from './costRoutes.ts'

export const router: express.Router = express.Router();

// GET all budgets
router.get('/', BudgetController.all);

// GET budget by ID page
router.get('/:budgetId', BudgetController.read);

// POST create budget
router.post('/', BudgetController.create);

// PUT update budget by ID
router.put('/:budgetId', BudgetController.update);

// DELETE budget by ID
router.delete('/:budgetId', BudgetController.delete);

// Nested cost routes for a specific budget
router.use('/:budgetId/costs', costRoutes);