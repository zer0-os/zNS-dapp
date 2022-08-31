export const getLastDomainName = (domain: string) => {
	const splited = domain.split('.');

	return splited[splited.length - 1];
};
