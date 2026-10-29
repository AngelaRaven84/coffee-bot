import { llm } from '@coffee-bot/llm';
import { orderPrompt } from '@coffee-bot/prompts';
import { orderSchema } from './orderSchema.js';
import { fetchMenu } from '@coffee-bot/api';

const structuredLLM = llm.withStructuredOutput(orderSchema);
const orderChain = orderPrompt.pipe(structuredLLM);

export const interpretOrder = async (question) => {
	const menu = await fetchMenu();

	const order = await orderChain.invoke({
		menu: JSON.stringify(menu),
		question,
	});

	const checkedItems = order.items.map((item) => {
		const product = menu.find(
			(product) =>
				product.title.toLowerCase() === item.name.trim().toLowerCase(),
		);

		if (!product) {
			throw new Error(`Produkten "${item.name}" finns inte i menyn.`);
		}

		return {
			name: product.title,
			quantity: item.quantity,
			price: product.price,
		};
	});

	const groupedItems = [];

	for (const item of checkedItems) {
		const existingItem = groupedItems.find(
			(product) => product.name === item.name,
		);

		if (existingItem) {
			existingItem.quantity += item.quantity;
		} else {
			groupedItems.push({ ...item });
		}
	}

	const total = groupedItems.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0,
	);

	return { items: groupedItems, total };
};
