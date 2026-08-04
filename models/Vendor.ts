import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm"
import { Cost } from "./Cost.ts"

@Entity()
export class Vendor {

		@PrimaryGeneratedColumn('uuid')
		id!: number

		@Column({ type: "varchar", length: 64 })
		name!: string

		@OneToMany(() => Cost, (cost: Cost) => cost.vendor)
		costs!: Cost

}
