import './index.css';

export const Button = ({
	children,
	type = 'button',
	onClick,
	disabled = false,
}) => {
	return (
		<button
			className='button'
			type={type}
			onClick={onClick}
			disabled={disabled}>
			{children}
		</button>
	);
};
