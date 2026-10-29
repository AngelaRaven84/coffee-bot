import { llm } from '@coffee-bot/llm';
import { toolChatPrompt } from '@coffee-bot/prompts';
import { getMenuTool } from '@coffee-bot/tools';

const modelWithTools = llm.bindTools([getMenuTool]);

export const invokeToolChat = async ({ history, question }) => {
	const messages = await toolChatPrompt.formatMessages({
		history,
		question,
	});

	for (let attempt = 0; attempt < 3; attempt += 1) {
		const answer = await modelWithTools.invoke(messages);

		if (!answer.tool_calls?.length) {
			return answer;
		}

		messages.push(answer);

		for (const toolCall of answer.tool_calls) {
			if (toolCall.name !== getMenuTool.name) {
				throw new Error('Modellen begärde ett okänt verktyg.');
			}

			const result = await getMenuTool.invoke(toolCall);
			messages.push(result);
		}
	}

	throw new Error('Baristan kunde inte slutföra svaret. försök igen.');
};
