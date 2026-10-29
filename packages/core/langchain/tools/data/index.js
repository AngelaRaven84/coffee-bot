import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { interpretOrder } from './orders.js';

export const previewOrderTool = tool(
	async ({ orderText }) => {
		const order = await interpretOrder(orderText);
		return JSON.stringify(order);
	},
	{
		name: 'preview_order',
		description:
			'Skapar ett beställningsförslag när kunden uttryckligen vill beställa. Använd inte för prisfrågor eller rekommendationer. Förslaget är inte bekräftad beställning.',
		schema: z.object({
			orderText: z
				.string()
				.describe(
					'Kundens beställning med kundens egna produktnamn och antal. Ersätt eller lägg inte till produkter.',
				),
		}),
	},
);
