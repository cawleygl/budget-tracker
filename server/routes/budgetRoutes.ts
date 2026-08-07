import express, { type Request, type Response }  from 'express';
import { BudgetController } from '../controllers/BudgetController.ts'
import { router as costRoutes } from './costRoutes.ts'

export const router: express.Router = express.Router();

// GET budget by ID page
router.get('/:id', BudgetController.show);

// POST create budget
router.post('/', BudgetController.create);

// PUT update budget by ID
router.put('/:id', BudgetController.update);

// DELETE budget by ID
router.delete('/:id', BudgetController.delete);

// Nested cost routes for a specific budget
router.use('/:budgetId/costs', costRoutes);