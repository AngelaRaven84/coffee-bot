import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { fetchMenu } from '@coffee-bot/api';

export const getMenuTool = tool(
	async () => {
		const menu = await fetchMenu();

		return JSON.stringify(menu);
	},
	{
		name: 'get_menu',
		description:
			'Hämtar caféets aktuella meny med produkter, beskrivningar och priser. Använd när du behöver menyinformation för att besvara kundens fråga.',
		schema: z.object({}),
	},
);
