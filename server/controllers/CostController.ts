import { type Request, type Response } from "express";
import { Controller } from "./Controller.ts";
import { AppDataSource } from "../db/data-source.ts";
import { Cost } from "../models/Cost.ts";

export class CostController extends Controller {
  // POST /costs - Create a Cost
  static async create(req: Request, res: Response) {
    const body = {
      budget: Controller.parseIDFromParams(req.params.budgetId),
      ...req.body,
    };
    try {
      const cost: Cost = await AppDataSource.manager.create(Cost, body);
      await AppDataSource.manager.save(cost);
      console.log(cost);
      if (!cost) {
        res.status(400).json({ error: "Cost not created" });
        return;
      }
      res.status(201).json(cost);
    } catch (error) {
      console.error("Error creating cost:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // GET /costs/:id - Get a single Cost
  static async read(req: Request, res: Response) {
    const id: string = Controller.parseIDFromParams(req.params.costId)
    try {
      const cost: Cost | null = await AppDataSource.manager.findOneBy(
        Cost,
        { id },
      );
      if (!cost) {
        res.status(404).json({ error: "Cost not found" });
        return;
      }
      res.status(200).json(cost);
    } catch (error) {
      console.error("Error fetching cost:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // PUT /costs/:costId - Update a Cost
  static async update(req: Request, res: Response) {
    try {
      await AppDataSource.manager.update(
        Cost, 
        { id: Controller.parseIDFromParams(req.params.costId) },
        { ...req.body }
      );
      res.status(204).send();
    } catch (error) {
      console.error("Error updating cost:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // DELETE /costs/:costId - Delete a Cost
  static async delete(req: Request, res: Response) {
    try {
      await AppDataSource.manager.delete(Cost, Controller.parseIDFromParams(req.params.costId));
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting cost:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
