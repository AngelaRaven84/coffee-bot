import './coffeemenu.css';

export const CoffeeMenu = ({ items, initiallyOpen = false }) => {
	return (
		<details className='coffee-menu' open={initiallyOpen}>
			<summary className='coffee-menu__toggle'>Visa menyn</summary>

			<ul className='coffee-menu__list'>
				{items.map((item) => (
					<li className='coffee-menu__item' key={item.id}>
						<div className='coffee-menu__heading'>
							<h3>{item.title}</h3>
							<span>{item.price} kr</span>
						</div>
						<p>{item.desc}</p>
					</li>
				))}
			</ul>
		</details>
	);
};
