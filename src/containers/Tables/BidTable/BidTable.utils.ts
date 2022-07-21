export const handleDomainNameWidth = (dimensions: number) => {
	const isMobileM = dimensions <= 400;
	const isMobileL = dimensions <= 481;
	const isMobileXL = dimensions <= 569;

	if (isMobileM) {
		return 175;
	} else if (isMobileL) {
		return 255;
	} else if (isMobileXL) {
		return 340;
	} else {
		return 420;
	}
};
