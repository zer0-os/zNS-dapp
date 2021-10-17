const RandomName = require('node-random-name');

export const randomNumber = (min: number, max: number, dp: number) => {
	var rand =
		Math.random() < 0.5
			? (1 - Math.random()) * (max - min) + min
			: Math.random() * (max - min) + min; // could be min or max or anything in between
	var power = Math.pow(10, dp);
	return Math.floor(rand * power) / power;
};

export const randomName = (seed: string) => {
	return RandomName({ seed: seed });
};

export const randomImage = (seed: string) => {
	return `https://picsum.photos/seed/${seed}/200/300`;
};

export const randomUUID = () => {
	const pattern = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';

	return pattern.replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0;
		const v = c === 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
};
