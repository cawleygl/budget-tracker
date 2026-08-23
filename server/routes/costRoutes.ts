import express, { type Request, type Response }  from 'express';
import { CostController } from '../controllers/CostController.ts'

export const router: express.Router = express.Router({mergeParams: true});

// Prefix /budgets/budgetID/costs 

// POST create cost on a budget
router.post('/', CostController.create);

// GET a cost
router.get('/:costId', CostController.read);

// PUT update cost by ID on a budget
router.put('/:costId', CostController.update);

// // DELETE cost by ID on a budget
router.delete('/:costId', CostController.delete);
