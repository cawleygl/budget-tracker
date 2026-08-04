import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm"
import { Cost } from "./Cost.ts"

@Entity()
export class PaymentMethod {

		@PrimaryGeneratedColumn('uuid')
		id!: number

		@Column({ type: "varchar", length: 64 })
		name!: string

		@OneToMany(() => Cost, (cost: Cost) => cost.payment_method)
		costs!: Cost

}
