import express, { type Request, type Response }  from 'express';
import { CostController } from '../controllers/CostController.ts'

export const router: express.Router = express.Router({mergeParams: true});

// Prefix /budgets/budgetID/costs 

// POST create cost on a budget
router.post('/', CostController.create);

// GET all costs on a budget
router.get('/', CostController.show);

// // PUT update cost by ID on a budget
// router.put('/:id', CostController.update);

// // DELETE cost by ID on a budget
// router.delete('/:id', CostController.delete);
