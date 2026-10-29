import { ChatOllama } from '@langchain/ollama';

export const llm = new ChatOllama({
	model: 'qwen3:4b-instruct',
	temperature: 0,
	topP: 0.5,
	numPredict: 200,
});
