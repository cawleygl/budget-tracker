import { type Request, type Response } from "express";
import { Controller } from "./Controller.ts";
import { AppDataSource } from "../db/data-source.ts";
import { Vendor } from "../models/Vendor.ts";
import type { Repository, InsertResult, UpdateResult, DeleteResult } from "typeorm";

export class VendorController extends Controller {
  private repository: Repository<Vendor>;

  constructor() {
    console.log("----------- Vendor Repository -----------");
    super();
    this.repository = AppDataSource.getRepository(Vendor);
  };

  // GET /vendors/ - Get all Vendors
  public all = async (req: Request, res: Response): Promise<void> => {
    try {
      const vendors: Vendor[] = await this.repository
        .createQueryBuilder("vendor")
        .select("vendor")
        .getMany();

      if (!vendors) {
        res.status(404).json({ error: "Vendors not found" });
        return;
      }
      res.status(200).json(vendors);
    } catch (error) {
      console.error("Error fetching all Vendors:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  // POST /vendors - Create a Vendor
  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const result: InsertResult = await this.repository
        .createQueryBuilder("vendor")
        .insert()
        .values(req.body)
        .returning("id")
        .execute();

      const generatedId: string = result.identifiers[0]?.id;

      if (!generatedId) {
        res.status(400).json({ error: "Vendor not created" });
        return;
      }
      res.status(201).json({ id: generatedId });
    } catch (error) {
      console.error("Error creating Vendor:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  // GET /vendors/:id - Get a single Vendor
  public read = async (req: Request, res: Response): Promise<void> => {
    const vendorId: string = super.parseIDFromParams(req.params.vendorId);
    try {
      const vendor: Vendor | null = await this.repository
        .createQueryBuilder("vendor")
        .where("vendor.id = :vendorId", { vendorId })
        .getOne();

      if (!vendor) {
        res.status(404).json({ error: "Vendor not found" });
        return;
      }
      res.status(200).json(vendor);
    } catch (error) {
      console.error("Error fetching Vendor:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  // PUT /vendors/:vendorId - Update a Vendor
  public update = async (req: Request, res: Response): Promise<void> => {
    try {
      const result: UpdateResult = await this.repository
        .createQueryBuilder("vendor")
        .update(Vendor)
        .set({ ...req.body })
        .where("vendor.id = :vendorId", {
          vendorId: super.parseIDFromParams(req.params.vendorId),
        })
        .execute();

      if (!result.affected || result.affected <= 0) {
        res.status(404).json({ error: "Vendor not found" });
        return;
      }

      res.status(204).send();
    } catch (error) {
      console.error("Error updating Vendor:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  // DELETE /vendors/:vendorId - Delete a Vendor
  public destroy = async (req: Request, res: Response): Promise<void> => {
    try {
      const result: DeleteResult = await this.repository
        .createQueryBuilder("vendor")
        .delete()
        .from(Vendor)
        .where("vendor.id = :vendorId", {
          vendorId: super.parseIDFromParams(req.params.vendorId),
        })
        .execute();

      if (!result.affected || result.affected <= 0) {
        res.status(404).json({ error: "Vendor not found" });
        return;
      }

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting Vendor:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
}
