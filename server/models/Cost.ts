import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  UpdateDateColumn,
  CreateDateColumn,
} from "typeorm";
import { Budget } from "./Budget.ts";
import { Vendor } from "./Vendor.ts";
import { PaymentMethod } from "./PaymentMethod.ts";

export const CostTypes = {
  CREDIT: "CREDIT",
  EXPENSE: "EXPENSE",
} as const;

export type CostType = (typeof CostTypes)[keyof typeof CostTypes];

@Entity()
export class Cost {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount!: number;

  @Column({ type: "varchar", length: 255 })
  description!: string;

  @Column({
    type: "enum",
    enum: CostTypes,
    default: CostTypes.EXPENSE,
  })
  type!: CostType;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt!: Date;

  @ManyToOne(() => Budget, (budget: Budget) => budget.costs, { onDelete: "CASCADE" })
  budget!: Budget;

  @ManyToOne(() => Vendor, (vendor: Vendor) => vendor.costs)
  vendor!: Vendor;

  @ManyToOne(
    () => PaymentMethod,
    (payment_method: PaymentMethod) => payment_method.costs
  )
  payment_method!: PaymentMethod;
}
