import { type Request, type Response } from "express";
import { AppDataSource } from "../db/data-source.ts";
import { Cost } from "../models/Cost.ts";

export class CostController {
  // POST /costs - Create a Cost
  static async create(req: Request, res: Response) {
    console.log("Controller");
    console.log(req.body);
    const body = { budget: req.params.budgetId, ...req.body };
    const cost: Cost = await AppDataSource.manager.create(Cost, body);
    await AppDataSource.manager.save(cost);
    console.log(cost);
    if (!cost) {
      res.status(400).json({ error: "Cost not created" });
      return;
    }
    res.status(201).json({ cost });
  }

  // GET /costs/:id - Get a single Cost by ID
  static async show(req: Request, res: Response) {
    // const id: string = (req.params.id && Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) ?? "";
    // const cost: Cost | null = await AppDataSource.manager.findOneBy(Cost, { id });
    // const costs: Cost[] = await AppDataSource.manager.find(Cost, { where: { cost: { id } } });
    // if (!cost) {
    //   res.status(404).send("Cost not found");
    //   return;
    // }
    // res.render("costs/showCost", { cost, costs, title: cost.name });
  }

  // PUT /costs/:id - Update a Cost
  static async update(req: Request, res: Response) {
    // const costRepository = AppDataSource.getRepository(Cost);
    // const cost = await costRepository.findOneBy({ id: parseInt(req.params.id) });
    // if (!cost) {
    //   res.status(404).send("Cost not found");
    //   return;
    // }
    // costRepository.merge(cost, req.body);
    // await costRepository.save(cost);
    // res.redirect(`/costs/${cost.id}`);
  }

  // DELETE /costs/:id - Delete a Cost
  static async delete(req: Request, res: Response) {
    // const costRepository = AppDataSource.getRepository(Cost);
    // const cost = await costRepository.findOneBy({ id: parseInt(req.params.id) });
    // if (!cost) {
    //   res.status(404).send("Cost not found");
    //   return;
    // }
    // await costRepository.remove(cost);
    // res.redirect("/costs");
  }  
  
}