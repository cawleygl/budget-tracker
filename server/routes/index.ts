import express, { type Request, type Response, type NextFunction } from "express";
import { router as budgetRoutes } from "./budgetRoutes.ts";

export const router = express.Router();

try {
  router.use((req: Request, res: Response, next: NextFunction) => {
    console.log("Message Received:", req.method, req.url);
    console.log(new Date(Date.now()).toString());
    next();
  });

  router.use("/budgets", budgetRoutes);

  router.use((req: Request, res: Response) => {
    console.error(req.method, req.body);
    res.status(404).json({ error: "Route Not Found" });
  });
} catch (error) {
  console.error("Error:", error);
  router.use((req: Request, res: Response) => {
    res.status(500).json({ error: "Internal Server Error" });
  });
}
