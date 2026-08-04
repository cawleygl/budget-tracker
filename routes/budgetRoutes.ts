import express, { type Request, type Response }  from 'express';
import { BudgetController } from '../controllers/BudgetController.ts'

export const budgetRoutes = express.Router({mergeParams: true});

// GET all budgets page
budgetRoutes.get('/', BudgetController.all);

// GET create budget page
budgetRoutes.get('/new', BudgetController.new);

// GET budget by ID page
budgetRoutes.get('/:id', BudgetController.show);

// POST create budget
budgetRoutes.post('/', BudgetController.create);

// PUT update budget by ID
budgetRoutes.put('/:id', BudgetController.update);

// DELETE budget by ID
budgetRoutes.delete('/:id', BudgetController.delete);
