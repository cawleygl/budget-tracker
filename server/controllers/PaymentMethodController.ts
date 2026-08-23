import { type Request, type Response } from "express";
import { Controller } from "./Controller.ts";
import { AppDataSource } from "../db/data-source.ts";
import { PaymentMethod } from "../models/PaymentMethod.ts";
import type { Repository, InsertResult, UpdateResult, DeleteResult } from "typeorm";

export class PaymentMethodController  extends Controller {
  private repository: Repository<PaymentMethod>;

  constructor() {
    console.log("----------- PaymentMethod Repository -----------");
    super();
    this.repository = AppDataSource.getRepository(PaymentMethod);
  }

  // GET /payments/ - Get all Payment Methods
  public all = async (req: Request, res: Response): Promise<void> => {
    try {
      const payments: PaymentMethod[] = await this.repository
        .createQueryBuilder("payment")
        .select("payment")
        .getMany();

      if (!payments) {
        res.status(404).json({ error: "Payment Methods not found" });
        return;
      }
      res.status(200).json(payments);
    } catch (error) {
      console.error("Error fetching all Payment Methods:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  // POST /payments - Create a Payment Method
  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const result: InsertResult = await this.repository
        .createQueryBuilder("payment")
        .insert()
        .values(req.body)
        .returning("id")
        .execute();

      const generatedId: string = result.identifiers[0]?.id;

      if (!generatedId) {
        res.status(400).json({ error: "Payment Method not created" });
        return;
      }
      res.status(201).json({ id: generatedId });
    } catch (error) {
      console.error("Error creating Payment Method:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

// GET /payments/:id - Get a single Payment
  public read = async (req: Request, res: Response): Promise<void> => {
    const paymentId: string = super.parseIDFromParams(req.params.paymentId);
    try {
      const payment: PaymentMethod | null = await this.repository
        .createQueryBuilder("payment")
        .where("payment.id = :paymentId", { paymentId })
        .getOne();

      if (!payment) {
        res.status(404).json({ error: "Payment Method not found" });
        return;
      }
      res.status(200).json(payment);
    } catch (error) {
      console.error("Error fetching Payment Method:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  // PUT /payments/:paymentId - Update a Payment
  public update = async (req: Request, res: Response): Promise<void> => {
    try {
      const result: UpdateResult = await this.repository
        .createQueryBuilder("payment")
        .update(PaymentMethod)
        .set({ ...req.body })
        .where("payment.id = :paymentId", {
          paymentId: super.parseIDFromParams(req.params.paymentId),
        })
        .execute();

      if (!result.affected || result.affected <= 0) {
        res.status(404).json({ error: "Payment Method not found" });
        return;
      }

      res.status(204).send();
    } catch (error) {
      console.error("Error updating Payment Method:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  // DELETE /payments/:paymentId - Delete a Payment
  public destroy = async (req: Request, res: Response): Promise<void> => {
    try {
      const result: DeleteResult = await this.repository
        .createQueryBuilder("payment")
        .delete()
        .from(PaymentMethod)
        .where("payment.id = :paymentId", {
          paymentId: super.parseIDFromParams(req.params.paymentId),
        })
        .execute();

      if (!result.affected || result.affected <= 0) {
        res.status(404).json({ error: "Payment Method not found" });
        return;
      }

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting Payment Method:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
}
