import { z } from 'zod';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { llm } from '@coffee-bot/llm';

const routeSchema = z.object({
	intent: z.enum(['chat', 'order']),
});

const routePrompt = ChatPromptTemplate.fromMessages([
	[
		'system',
		`Klassificiera ett meddelande till ett café.
        
        Välj order när kunder anger produkter som hen vill beställa. En produktlista som "en latte och två semlor" är också order. Välj chat för prisfrågor, menyfrågor, rekommendationer och småprat. "Vad kostar två cappuccino?" är chat. "Jag vill beställa två cappuccino" är order.
        
        Klassificera bara. Ändra inte kundens meddelande.`,
	],
	['human', '{question}'],
]);

const routeChain = routePrompt.pipe(llm.withStructuredOutput(routeSchema));

export const routeMessage = (question) => routeChain.invoke({ question });
