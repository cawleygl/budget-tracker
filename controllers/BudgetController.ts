import { type Request, type Response } from "express";
import { AppDataSource } from "../db/data-source.ts";
import { Budget } from "../models/Budget.ts";
import type { Repository } from "typeorm";

export class BudgetController {
  connectToDB(): Repository<Budget> {
    return AppDataSource.getRepository(Budget);
  }

  // GET /budgets - Get all Budgets
  static async all(req: Request, res: Response) {
    const budgets: Budget[] = await this.connectToDB().find();
    res.render("budgets/allBudgets", { budgets });
  }

  // GET /budgets/new - Serve Create Budget form
  static async new(req: Request, res: Response) {
    res.render("budgets/createBudget");
  }

  // POST /budgets - Create a Budget
  static async create(req: Request, res: Response) {
    const budgetRepository: Repository<Budget> = this.connectToDB();
    const budget: Budget[] = budgetRepository.create(req.body);
    await budgetRepository.save(budget);
    res.redirect("/budgets");
  }

  // GET /budgets/:id - Get a single Budget by ID
  static async show(req: Request, res: Response) {
    const id: string = (req.params.id && Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) ?? "";
    const budgetRepository: Repository<Budget> = this.connectToDB();
    const budget: Budget | null = await budgetRepository.findOneBy({ id: parseInt(id) });
    if (!budget) {
      res.status(404).send("Budget not found");
      return;
    }
    res.render("budgets/showBudget", { budget });
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