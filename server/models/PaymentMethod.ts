import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm"
import { Cost } from "./Cost.ts"

@Entity()
export class PaymentMethod {

		@PrimaryGeneratedColumn('uuid')
		id!: string

		@Column({ type: "varchar", length: 64 })
		name!: string

		@OneToMany(() => Cost, (cost: Cost) => cost.payment_method, { onDelete: "SET NULL" })
		costs!: Cost

}
