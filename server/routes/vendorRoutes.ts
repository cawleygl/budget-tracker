import express, { type Request, type Response }  from 'express';
import { VendorController } from '../controllers/VendorController.ts'

export const router: express.Router = express.Router({mergeParams: true});

const controller: VendorController = new VendorController();

// GET get all vendors
router.get('/', controller.all);

// GET get one payment methods
router.get('/:vendorId', controller.read);

// POST create a vendor
router.post('/', controller.create);

// PUT update vendor by ID on a budget
router.put('/:vendorId', controller.update);

// // DELETE vendor by ID on a budget
router.delete('/:vendorId', controller.destroy);
