import { type Request, type Response } from "express";
import { AppDataSource } from "../db/data-source.ts";
import { Budget } from "../models/Budget.ts";
import { Cost } from "../models/Cost.ts";
import type { Repository } from "typeorm";

export class BudgetController {
  // POST /budgets - Create a Budget
  static async create(req: Request, res: Response) {
    const budget: Budget = await AppDataSource.manager.create(Budget, req.body);
    await AppDataSource.manager.save(budget);
    if (!budget) {
      res.status(400).json({ error: "Budget not created" });
      return;
    }
    res.status(201).json({ budget });
  }

  // GET /budgets/:id - Get a single Budget by ID + associated Costs
  static async show(req: Request, res: Response) {
    const id: string = (req.params.id && Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) ?? "";
    const budget: Budget | null = await AppDataSource.manager.findOneBy(Budget, { id });
    const costs: Cost[] = await AppDataSource.manager.find(Cost, { where: { budget: { id } } });
    if (!budget) {
      res.status(404).json({ error: "Budget not found" });
      return;
    }
    res.status(200).json({ budget, costs });
  }

  // PUT /budgets/:id - Update a Budget
  static async update(req: Request, res: Response) {
    // const budgetRepository = AppDataSource.getRepository(Budget);
    // const budget = await budgetRepository.findOneBy({ id: parseInt(req.params.id) });
    // if (!budget) {
    //   res.status(404).send("Budget not found");
    //   return;
    // }
    // budgetRepository.merge(budget, req.body);
    // await budgetRepository.save(budget);
    // res.redirect(`/budgets/${budget.id}`);
  }

  // DELETE /budgets/:id - Delete a Budget
  static async delete(req: Request, res: Response) {
    // const budgetRepository = AppDataSource.getRepository(Budget);
    // const budget = await budgetRepository.findOneBy({ id: parseInt(req.params.id) });
    // if (!budget) {
    //   res.status(404).send("Budget not found");
    //   return;
    // }
    // await budgetRepository.remove(budget);
    // res.redirect("/budgets");
  }  
  
}