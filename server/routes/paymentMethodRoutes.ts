import express, { type Request, type Response }  from 'express';
import { PaymentMethodController } from '../controllers/PaymentMethodController.ts'

export const router: express.Router = express.Router({mergeParams: true});

// GET get all payment methods
router.get('/', PaymentMethodController.all);

// GET get one payment methods
router.get('/:paymentId', PaymentMethodController.read);

// POST create a payment method
router.post('/', PaymentMethodController.create);

// PUT update payment method by ID on a budget
router.put('/:paymentId', PaymentMethodController.update);

// // DELETE payment method by ID on a budget
router.delete('/:paymentId', PaymentMethodController.delete);
