import './chatmessage.css';

export const ChatMessage = ({ children, role }) => {
	return (
		<p className={`chat-message chat-message--${role}`}>
			<strong className='chat-message__author'>
				{role === 'user' ? 'Du' : 'Baristan'}
			</strong>
			{children}
		</p>
	);
};
