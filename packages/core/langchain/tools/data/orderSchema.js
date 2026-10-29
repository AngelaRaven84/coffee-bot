import { z } from 'zod';

export const orderSchema = z.object({
	items: z.array(
		z.object({
			name: z.string().describe('Produktnamnet som kunden skrev det'),
			quantity: z.number().int().positive().describe('Antal av produkten'),
		}),
	),
});
