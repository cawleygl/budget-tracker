import express, { type Request, type Response }  from 'express';
import { VendorController } from '../controllers/VendorController.ts'

export const router: express.Router = express.Router({mergeParams: true});

// GET get all vendors
router.get('/', VendorController.all);

// GET get one payment methods
router.get('/:vendorId', VendorController.read);

// POST create a vendor
router.post('/', VendorController.create);

// PUT update vendor by ID on a budget
router.put('/:vendorId', VendorController.update);

// // DELETE vendor by ID on a budget
router.delete('/:vendorId', VendorController.delete);
