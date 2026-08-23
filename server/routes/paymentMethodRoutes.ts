import express, { type Request, type Response }  from 'express';
import { PaymentMethodController } from '../controllers/PaymentMethodController.ts'

export const router: express.Router = express.Router({mergeParams: true});

const controller: PaymentMethodController = new PaymentMethodController();

// GET get all payment methods
router.get('/', controller.all);

// GET get one payment methods
router.get('/:paymentId', controller.read);

// POST create a payment method
router.post('/', controller.create);

// PUT update payment method by ID on a budget
router.put('/:paymentId', controller.update);

// // DELETE payment method by ID on a budget
router.delete('/:paymentId', controller.destroy);
