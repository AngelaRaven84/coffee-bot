export const fetchMenu = async () => {
	const response = await fetch('https://santosnr6.github.io/Data/airbean.json');

	if (!response.ok) {
		throw new Error(`Kunde inte hämta menyn (${response.status}).`);
	}

	const data = await response.json();

	return data;
};
