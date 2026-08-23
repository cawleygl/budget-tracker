import { type Request, type Response } from "express";
import { Controller } from "./Controller.ts";
import { AppDataSource } from "../db/data-source.ts";
import { Vendor } from "../models/Vendor.ts";

export class VendorController extends Controller {
  // GET /vendors/ - Get all Vendors
  static async all(req: Request, res: Response) {
    try {
      const vendors: Vendor[] | null = await AppDataSource.manager.find(Vendor);
      if (!vendors) {
        res.status(404).json({ error: "Vendors not found" });
        return;
      }
      res.status(200).json(vendors);
    } catch (error) {
      console.error("Error fetching all vendors:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // POST /vendors - Create a Vendor
  static async create(req: Request, res: Response) {
    try {
      const vendor: Vendor = await AppDataSource.manager.create(
        Vendor,
        req.body,
      );
      await AppDataSource.manager.save(vendor);
      if (!vendor) {
        res.status(400).json({ error: "Vendor not created" });
        return;
      }
      res.status(201).json(vendor);
    } catch (error) {
      console.error("Error creating vendor:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // GET /vendors/:id - Get a single Vendor
  static async read(req: Request, res: Response) {
    const id: string = Controller.parseIDFromParams(req.params.vendorId)
    try {
      const vendor: Vendor | null = await AppDataSource.manager.findOneBy(
        Vendor,
        { id },
      );
      if (!vendor) {
        res.status(404).json({ error: "Vendor not found" });
        return;
      }
      res.status(200).json(vendor);
    } catch (error) {
      console.error("Error fetching vendor:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // PUT /vendors/:vendorId - Update a Vendor
  static async update(req: Request, res: Response) {
    try {
      await AppDataSource.manager.update(
        Vendor, 
        { id: Controller.parseIDFromParams(req.params.vendorId) },
        { ...req.body }
      );
      res.status(204).send();
    } catch (error) {
      console.error("Error updating vendor:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // DELETE /vendors/:vendorId - Delete a Vendor
  static async delete(req: Request, res: Response) {
    try {
      await AppDataSource.manager.delete(Vendor, Controller.parseIDFromParams(req.params.vendorId));
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting vendor:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
