import "reflect-metadata";
import { DataSource } from "typeorm";
import { Budget } from "../models/Budget.ts";
import { Cost } from "../models/Cost.ts";
import { Vendor } from "../models/Vendor.ts";
import { PaymentMethod } from "../models/PaymentMethod.ts";

export const AppDataSource = new DataSource({
    type: "postgres",
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [ Budget, Cost, Vendor, PaymentMethod ],
    migrations: [],
    subscribers: [],
    ssl: true
})
