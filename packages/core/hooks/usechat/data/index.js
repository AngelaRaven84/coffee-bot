import { useState } from 'react';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import { invokeAssistant } from '@coffee-bot/assistant';
import { fetchMenu } from '@coffee-bot/api';

export const useChat = () => {
	const [messages, setMessages] = useState([
		{
			role: 'assistant',
			content: 'Hej! Vad vill du dricka?',
		},
	]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const sendMessage = async (content) => {
		if (isLoading) return;

		const wantsConfirmation =
			/^(?:jag bekräftar|bekräfta|bekräftar|ändra inget, jag bekräftar)[.!]*$/i.test(
				content.trim(),
			);

		if (wantsConfirmation) {
			const pendingIndex = messages.findLastIndex(
				(message) => message.orderStatus === 'pending',
			);

			if (pendingIndex !== -1) {
				confirmOrder(pendingIndex);
			}

			setMessages((previousMessages) => [
				...previousMessages,
				{ role: 'user', content },
				{
					role: 'assistant',
					content:
						pendingIndex !== -1
							? 'Ditt beställningskort är nu bekräftat lokalt i appen.'
							: 'Det finns inget beställningskort att bekräfta ännu.',
				},
			]);

			return;
		}

		const nextMessages = [...messages, { role: 'user', content }];

		setMessages(nextMessages);

		const wantsMenu =
			/^(?:(?:kan|får) jag (?:få )?se (?:hela )?menyn|visa (?:mig )?(?:hela )?menyn|menyn)(?: tack)?[.!?]*$/i.test(
				content.trim(),
			);

		if (wantsMenu) {
			setIsLoading(true);
			setError(null);

			try {
				const menu = await fetchMenu();

				setMessages([
					...nextMessages,
					{
						role: 'assistant',
						content: 'Här är vår meny med alla produkter och priser.',
						type: 'menu',
						items: menu,
					},
				]);
			} catch (error) {
				setError(error.message);
			} finally {
				setIsLoading(false);
			}

			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const history = messages.map((message) =>
				message.role === 'user'
					? new HumanMessage(message.content)
					: new AIMessage(message.content),
			);

			const answer = await invokeAssistant({
				history,
				question: content,
			});

			setMessages((previousMessages) => [
				...previousMessages,
				{
					role: 'assistant',
					content: answer.content,
					...(answer.order?.items.length > 0 && {
						order: answer.order,
						orderStatus: 'pending',
					}),
				},
			]);
		} catch (error) {
			setError(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	const confirmOrder = (messageIndex) => {
		if (isLoading) return;

		setMessages((previousMessages) =>
			previousMessages.map((message, index) =>
				index === messageIndex && message.orderStatus === 'pending'
					? { ...message, orderStatus: 'confirmed' }
					: message,
			),
		);
	};

	const editOrder = (messageIndex) => {
		if (isLoading) return;

		setMessages((previousMessages) => {
			const selectedMessage = previousMessages[messageIndex];

			if (selectedMessage?.orderStatus !== 'pending') {
				return previousMessages;
			}

			return [
				...previousMessages.map((message, index) =>
					index === messageIndex
						? { ...message, orderStatus: 'editing' }
						: message,
				),
				{
					role: 'assistant',
					content:
						'Skriv hela din uppdaterade beställning med alla produkter och antal, så skapar jag ett nytt förslag.',
				},
			];
		});
	};

	const clearChat = () => {
		if (isLoading) return;

		setMessages([
			{
				role: 'assistant',
				content: 'Hej! Vad vill du dricka?',
			},
		]);
		setError(null);
	};

	return {
		messages,
		sendMessage,
		isLoading,
		error,
		clearChat,
		confirmOrder,
		editOrder,
	};
};
