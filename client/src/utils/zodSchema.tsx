import * as z from "zod";

export const PostBudgetPayload = z.object({
	name: z.string(),
	amount: z.coerce.number(),
	start: z.coerce.date(),
	expiration: z.coerce.date()
});

export const PostCostPayload = z.object({
	description: z.string(),
	amount: z.coerce.number()
});