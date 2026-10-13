import * as z from "zod";

const nullableDate = z.preprocess(
	(value) => (value === null || value === undefined || value === "" ? null : value),
	z.coerce.date().nullable(),
);

export const PostBudgetPayload = z.object({
	name: z.string(),
	amount: z.coerce.number(),
	type: z.enum(["REPEATING", "RUNNING"]),
	// Empty / missing values mean "no date" (z.coerce.date would turn null into the epoch)
	start: nullableDate,
	expiration: nullableDate
});

export const PostCostPayload = z.object({
	description: z.string(),
	amount: z.coerce.number(),
	type: z.enum(["CREDIT", "EXPENSE"]),
});