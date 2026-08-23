import { type Request, type Response } from "express";
import { Controller } from "./Controller.ts";
import { AppDataSource } from "../db/data-source.ts";
import { Budget } from "../models/Budget.ts";

export class BudgetController extends Controller {
  // GET /budgets/ - Get all Budgets
  static async all(req: Request, res: Response) {
    try {
      const budgets: Budget[] | null = await AppDataSource.manager.find(Budget);
      if (!budgets) {
        res.status(404).json({ error: "Budgets not found" });
        return;
      }
      res.status(200).json(budgets);
    } catch (error) {
      console.error("Error fetching all budgets:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // POST /budgets - Create a Budget
  static async create(req: Request, res: Response) {
    try {
      const budget: Budget = await AppDataSource.manager.create(
        Budget,
        req.body,
      );
      await AppDataSource.manager.save(budget);
      if (!budget) {
        res.status(400).json({ error: "Budget not created" });
        return;
      }
      res.status(201).json(budget);
    } catch (error) {
      console.error("Error creating budget:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // GET /budgets/:budgetId - Get a single Budget by ID + associated Costs
  static async read(req: Request, res: Response) {
    const id: string = Controller.parseIDFromParams(req.params.budgetId)
    try {
      const budget: Budget | null = await AppDataSource.manager.findOneBy(
        Budget,
        { id },
      );
      if (!budget) {
        res.status(404).json({ error: "Budget not found" });
        return;
      }
      res.status(200).json(budget);
    } catch (error) {
      console.error("Error fetching budget:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // PUT /budgets/:budgetId - Update a Budget
  static async update(req: Request, res: Response) {
    try {
      await AppDataSource.manager.update(
        Budget, 
        { id: Controller.parseIDFromParams(req.params.budgetId) },
        { ...req.body }
      );
      res.status(204).send();
    } catch (error) {
      console.error("Error updating budget:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // DELETE /budgets/:budgetId - Delete a Budget
  static async delete(req: Request, res: Response) {
    try {
      await AppDataSource.manager.delete(Budget, Controller.parseIDFromParams(req.params.budgetId));
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting budget:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}