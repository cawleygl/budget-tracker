import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  UpdateDateColumn,
  CreateDateColumn,
} from "typeorm";
import { Cost } from "./Cost.ts";

export const BudgetTypes = {
  REPEATING: "REPEATING",
  RUNNING: "RUNNING",
} as const;

export type BudgetType = (typeof BudgetTypes)[keyof typeof BudgetTypes];

@Entity()
export class Budget {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: "varchar", length: 64 })
  name!: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount!: number;

  // Source of truth for repeating vs running. Running budgets ignore and
  // store null for start and expiration.
  @Column({
    type: "enum",
    enum: BudgetTypes,
    default: BudgetTypes.REPEATING,
  })
  type!: BudgetType;

  @Column({ type: "timestamp with time zone", nullable: true })
  start!: Date | null;

  @Column({ type: "timestamp with time zone", nullable: true })
  expiration!: Date | null;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt!: Date;

  @OneToMany(() => Cost, (cost: Cost) => cost.budget)
  costs!: Cost[];
}
