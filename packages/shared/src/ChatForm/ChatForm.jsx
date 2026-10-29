import { useEffect, useRef } from 'react';
import './chatform.css';

export const ChatForm = ({ onSend, isLoading }) => {
	const handleSubmit = (event) => {
		event.preventDefault();

		const form = event.currentTarget;
		const formData = new FormData(form);
		const message = formData.get('message').trim();

		if (!message) return;

		onSend(message);
		form.reset();
	};

	const inputRef = useRef(null);

	useEffect(() => {
		if (!isLoading) {
			inputRef.current?.focus({ preventScroll: true });
		}
	}, [isLoading]);

	return (
		<form className='chat-form' onSubmit={handleSubmit}>
			<label htmlFor='chat-message'>Ditt meddelande</label>
			<input
				ref={inputRef}
				type='text'
				id='chat-message'
				name='message'
				disabled={isLoading}
			/>
			<button type='submit' disabled={isLoading}>
				Skicka
			</button>
		</form>
	);
};
