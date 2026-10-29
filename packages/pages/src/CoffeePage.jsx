import { useChat } from '@coffee-bot/usechat';
import {
	ChatMessage,
	ChatForm,
	CoffeeMenu,
	OrderCard,
} from '@coffee-bot/shared';
import { useEffect, useRef } from 'react';
import { Button } from '@coffee-bot/button';
import './coffeepage.css';

export const CoffeePage = () => {
	const {
		messages,
		sendMessage,
		isLoading,
		error,
		clearChat,
		confirmOrder,
		editOrder,
	} = useChat();

	const bottomRef = useRef(null);
	const wasLoadingRef = useRef(false);

	useEffect(() => {
		if (
			!isLoading &&
			(wasLoadingRef.current || messages.at(-1)?.type === 'menu')
		) {
			const reduceMotion = window.matchMedia(
				'(prefers-reduced-motion: reduce)',
			).matches;

			bottomRef.current?.scrollIntoView({
				behavior: reduceMotion ? 'instant' : 'smooth',
				block: 'end',
			});
		}

		wasLoadingRef.current = isLoading;
	}, [isLoading, messages]);

	return (
		<main className='coffee-page'>
			<h1 className='coffee-page__title'>Coffee Bot</h1>

			<div className='coffee-page__actions'>
				<Button onClick={clearChat} disabled={isLoading}>
					Rensa chatt
				</Button>
			</div>

			{messages.map((message, index) => (
				<div key={index}>
					<ChatMessage role={message.role}>{message.content}</ChatMessage>

					{message.order && (
						<OrderCard
							order={message.order}
							orderStatus={message.orderStatus}
							onConfirm={() => confirmOrder(index)}
							onEdit={() => editOrder(index)}
							isLoading={isLoading}
						/>
					)}

					{message.type === 'menu' && (
						<CoffeeMenu items={message.items} initiallyOpen />
					)}
				</div>
			))}

			{error && (
				<p className='coffee-page__error' role='alert'>
					Kunde inte hämta svar: {error}
				</p>
			)}

			{isLoading && (
				<p className='coffee-page__status' role='status'>
					Baristan tänker...
				</p>
			)}
			<ChatForm onSend={sendMessage} isLoading={isLoading} />

			<div ref={bottomRef} className='coffee-page__bottom' />
		</main>
	);
};
