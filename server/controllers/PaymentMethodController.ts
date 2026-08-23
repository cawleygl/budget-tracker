import { type Request, type Response } from "express";
import { Controller } from "./Controller.ts";
import { AppDataSource } from "../db/data-source.ts";
import { PaymentMethod } from "../models/PaymentMethod.ts";

export class PaymentMethodController  extends Controller {
  // GET /payments/ - Get all Payment Methods
  static async all(req: Request, res: Response) {
    try {
      const payments: PaymentMethod[] | null =
        await AppDataSource.manager.find(PaymentMethod);
      if (!payments) {
        res.status(404).json({ error: "Payment Methods not found" });
        return;
      }
      res.status(200).json(payments);
    } catch (error) {
      console.error("Error fetching all payment methods:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // POST /payments - Create a Payment Method
  static async create(req: Request, res: Response) {
    try {
      const payment: PaymentMethod = await AppDataSource.manager.create(
        PaymentMethod,
        req.body,
      );
      await AppDataSource.manager.save(payment);
      if (!payment) {
        res.status(400).json({ error: "Payment Method not created" });
        return;
      }
      res.status(201).json(payment);
    } catch (error) {
      console.error("Error creating payment method:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

// GET /payments/:id - Get a single Payment
  static async read(req: Request, res: Response) {
    const id: string = Controller.parseIDFromParams(req.params.paymentId)
    try {
      const payment: PaymentMethod | null = await AppDataSource.manager.findOneBy(
        PaymentMethod,
        { id },
      );
      if (!payment) {
        res.status(404).json({ error: "Payment Method not found" });
        return;
      }
      res.status(200).json(payment);
    } catch (error) {
      console.error("Error fetching payment method:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // PUT /payments/:paymentId - Update a Payment
  static async update(req: Request, res: Response) {
    try {
      await AppDataSource.manager.update(
        PaymentMethod, 
        { id: Controller.parseIDFromParams(req.params.paymentId) },
        { ...req.body }
      );
      res.status(204).send();
    } catch (error) {
      console.error("Error updating payment method:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // DELETE /payments/:paymentId - Delete a Payment
  static async delete(req: Request, res: Response) {
    try {
      await AppDataSource.manager.delete(PaymentMethod, Controller.parseIDFromParams(req.params.paymentId));
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting payment method:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
