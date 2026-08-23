import { type Request, type Response } from "express";
import { Controller } from "./Controller.ts";
import { AppDataSource } from "../db/data-source.ts";
import { Budget } from "../models/Budget.ts";
import type { Repository, InsertResult, UpdateResult, DeleteResult } from "typeorm";

export class BudgetController extends Controller {
  private repository: Repository<Budget>;

  constructor() {
    console.log("----------- Budget Repository -----------");
    super();
    this.repository = AppDataSource.getRepository(Budget);
  };

  // GET /budgets/ - Get all Budgets
  public all = async (req: Request, res: Response): Promise<void> => {
    try {
      const budgets: Budget[] = await this.repository
        .createQueryBuilder("budget")
        .select("budget")
        .getMany();

      if (!budgets) {
        res.status(404).json({ error: "Budgets not found" });
        return;
      }
      res.status(200).json(budgets);
    } catch (error) {
      console.error("Error fetching all Budgets:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  // POST /budgets - Create a Budget
  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const result: InsertResult = await this.repository
        .createQueryBuilder("budget")
        .insert()
        .values(req.body)
        .returning("id")
        .execute();

      const generatedId: string = result.identifiers[0]?.id;

      if (!generatedId) {
        res.status(400).json({ error: "Budget not created" });
        return;
      }
      res.status(201).json({ id: generatedId });
    } catch (error) {
      console.error("Error creating Budget:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  // GET /budgets/:budgetId - Get a single Budget by ID + associated Costs
  public read = async (req: Request, res: Response): Promise<void> => {
    const budgetId: string = super.parseIDFromParams(req.params.budgetId);
    try {
      const budget: Budget | null = await this.repository
        .createQueryBuilder("budget")
        .leftJoinAndSelect("budget.costs", "cost")
        .where("budget.id = :budgetId", { budgetId })
        .getOne();

      if (!budget) {
        res.status(404).json({ error: "Budget not found" });
        return;
      }
      res.status(200).json(budget);
    } catch (error) {
      console.error("Error fetching Budget:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  // PUT /budgets/:budgetId - Update a Budget
  public update = async (req: Request, res: Response): Promise<void> => {
    try {
      const result: UpdateResult = await this.repository
        .createQueryBuilder("budget")
        .update(Budget)
        .set({ ...req.body })
        .where("budget.id = :budgetId", {
          budgetId: super.parseIDFromParams(req.params.budgetId),
        })
        .execute();

      if (!result.affected || result.affected <= 0) {
        res.status(404).json({ error: "Budget not found" });
        return;
      }

      res.status(204).send();
    } catch (error) {
      console.error("Error updating Budget:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  // DELETE /budgets/:budgetId - Delete a Budget
  public destroy = async (req: Request, res: Response): Promise<void> => {
    try {
      const result: DeleteResult = await this.repository
        .createQueryBuilder("budget")
        .delete()
        .from(Budget)
        .where("budget.id = :budgetId", {
          budgetId: super.parseIDFromParams(req.params.budgetId),
        })
        .execute();

      if (!result.affected || result.affected <= 0) {
        res.status(404).json({ error: "Budget not found" });
        return;
      }

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting Budget:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
}
