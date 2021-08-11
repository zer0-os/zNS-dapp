export const toFiat = (x: number) =>
	x.toLocaleString(undefined, {
		maximumFractionDigits: 2,
		minimumFractionDigits: 2,
	});
