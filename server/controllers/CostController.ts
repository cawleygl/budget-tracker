import { type Request, type Response } from "express";
import { Controller } from "./Controller.ts";
import { AppDataSource } from "../db/data-source.ts";
import { Cost } from "../models/Cost.ts";
import type { Repository, InsertResult, UpdateResult, DeleteResult } from "typeorm";

export class CostController extends Controller {
  private repository: Repository<Cost>;

  constructor() {
    console.log("----------- Cost Repository -----------");
    super();
    this.repository = AppDataSource.getRepository(Cost);
  };
    
  // POST /costs - Create a Cost
  public create = async (req: Request, res: Response): Promise<void> => {
    const body = {
      budget: super.parseIDFromParams(req.params.budgetId),
      ...req.body,
    };
    try {
      const result: InsertResult = await this.repository
        .createQueryBuilder("cost")
        .insert()
        .values(body)
        .returning("id")
        .execute();

      const generatedId: string = result.identifiers[0]?.id;

      if (!generatedId) {
        res.status(400).json({ error: "Cost not created" });
        return;
      }
      res.status(201).json({ id: generatedId });
    } catch (error) {
      console.error("Error creating Cost:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  // GET /costs/:id - Get a single Cost
  public read = async (req: Request, res: Response): Promise<void> => {
    const costId: string = super.parseIDFromParams(req.params.costId);
    try {
      const cost: Cost | null = await this.repository
        .createQueryBuilder("cost")
        .leftJoinAndSelect("cost.vendor", "vendor.name")
        .leftJoinAndSelect("cost.payment_method", "payment_method.name")
        .where("cost.id = :costId", { costId })
        .getOne();

      if (!cost) {
        res.status(404).json({ error: "Cost not found" });
        return;
      }
      res.status(200).json(cost);
    } catch (error) {
      console.error("Error fetching Cost:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  // PUT /costs/:costId - Update a Cost
  public update = async (req: Request, res: Response): Promise<void> => {
    try {
      const result: UpdateResult = await this.repository
        .createQueryBuilder("cost")
        .update(Cost)
        .set({ ...req.body })
        .where("cost.id = :costId", {
          costId: super.parseIDFromParams(req.params.costId),
        })
        .execute();

      if (!result.affected || result.affected <= 0) {
        res.status(404).json({ error: "Cost not found" });
        return;
      }

      res.status(204).send();
    } catch (error) {
      console.error("Error updating Cost:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  // DELETE /costs/:costId - Delete a Cost
  public destroy = async (req: Request, res: Response): Promise<void> => {
    try {
      const result: DeleteResult = await this.repository
        .createQueryBuilder("cost")
        .delete()
        .from(Cost)
        .where("cost.id = :costId", {
          costId: super.parseIDFromParams(req.params.costId),
        })
        .execute();

      if (!result.affected || result.affected <= 0) {
        res.status(404).json({ error: "Cost not found" });
        return;
      }

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting Cost:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
}
