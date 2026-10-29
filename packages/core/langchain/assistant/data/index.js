import { invokeToolChat } from './toolChat.js';
import { previewOrderTool } from '@coffee-bot/tools';
import { routeMessage } from './routeMessage.js';

export const invokeAssistant = async ({ history, question }) => {
	const { intent } = await routeMessage(question);

	if (intent === 'order') {
		const result = await previewOrderTool.invoke({
			orderText: question,
		});

		const order = JSON.parse(result);

		if (!order.items.length) {
			return {
				content:
					'Jag kunde inte identifiera beställningen. Skriv produkterna och antalet igen.',
				order: null,
			};
		}

		return {
			content:
				'Granska ditt beställningsförslag nedan. Välj Bekräfta eller Ändra.',
			order,
		};
	}

	const answer = await invokeToolChat({
		history,
		question,
	});

	return {
		content: answer.content,
		order: null,
	};
};
