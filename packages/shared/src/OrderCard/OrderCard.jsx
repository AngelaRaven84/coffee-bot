import { Button } from '@coffee-bot/button';
import './ordercard.css';

export const OrderCard = ({
	order,
	orderStatus,
	onConfirm,
	onEdit,
	isLoading,
}) => {
	return (
		<section className='order-card' aria-label='Beställningsförslag'>
			<h2>Din beställning</h2>
			<ul>
				{order.items.map((item) => (
					<li key={item.name}>
						{item.quantity} x {item.name}
					</li>
				))}
			</ul>
			<p>
				<strong>Totalt: {order.total} kr</strong>
			</p>
			{orderStatus === 'pending' && (
				<div className='order-card__actions'>
					<Button onClick={onConfirm} disabled={isLoading}>
						Bekräfta
					</Button>

					<Button onClick={onEdit} disabled={isLoading}>
						Ändra
					</Button>
				</div>
			)}

			{orderStatus === 'confirmed' && (
				<p role='status'>Beställningen är bekräftad lokalt i appen.</p>
			)}

			{orderStatus === 'editing' && (
				<p>Det här förslaget ändras. Skriv din nya beställning.</p>
			)}
		</section>
	);
};
