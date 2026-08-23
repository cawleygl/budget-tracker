import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { router as budgetRoutes } from "./budgetRoutes.ts";   
import { router as vendorRoutes } from "./vendorRoutes.ts";   
import { router as paymentMethodRoutes } from "./paymentMethodRoutes.ts";   

export const router = express.Router();

router.use((req: Request, res: Response, next: NextFunction) => {
  console.log("Message Received:", req.method, req.url);
  console.log(new Date(Date.now()).toString());
  next();
});

router.use("/budgets", budgetRoutes);
router.use("/vendors", vendorRoutes);
router.use("/payments", paymentMethodRoutes);

router.use((req: Request, res: Response) => {
  console.error(req.method, req.body);
  res.status(404).json({ error: "Route Not Found" });
});
