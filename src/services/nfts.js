const users = {
	frank: {
		name: 'Frank Wilder',
		img: 'assets/dp/fake01.jpg',
	},
	ccat: {
		name: 'C-Cat',
		img: 'assets/dp/fake02.jpg',
	},
	hypno: {
		name: 'Hypno Wilder',
		img: 'assets/dp/fake03.jpg',
	},
};

const nfts = [
	{
		creator: users.frank,
		owner: users.frank,
		name: 'Blue Pill/Red Pill',
		domain: 'bluepillredpill',
		img: 'assets/nft/redpill.png',
		price: '250',
	},
	{
		creator: users.frank,
		owner: users.frank,
		name: `Satoshi's Revenge`,
		domain: 'satoshisrevenge',
		img: 'assets/nft/revenge.png',
		price: '250',
	},
	{
		creator: users.frank,
		owner: users.ccat,
		name: `The Grass Is Greener`,
		domain: 'thegrassisgreener',
		img: 'assets/nft/greener.png',
		price: '250',
	},
	{
		creator: users.frank,
		owner: users.hypno,
		name: `Mossy Haven`,
		domain: 'mossyhaven',
		img: 'assets/nft/mossy.png',
		price: '250',
	},
];

const getAll = () => nfts;
const getOwnedBy = (user) => nfts.filter((n) => n.owner.name === user);
const getCreatedBy = (user) => nfts.filter((n) => n.creator.name === user);

export default { getAll, getOwnedBy, getCreatedBy };
