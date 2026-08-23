import express, { type Request, type Response }  from 'express';
import { CostController } from '../controllers/CostController.ts'

export const router: express.Router = express.Router({mergeParams: true});

const controller: CostController = new CostController();

// Prefix /budgets/budgetID/costs 

// POST create cost on a budget
router.post('/', controller.create);

// GET a cost
router.get('/:costId', controller.read);

// PUT update cost by ID on a budget
router.put('/:costId', controller.update);

// // DELETE cost by ID on a budget
router.delete('/:costId', controller.destroy);
