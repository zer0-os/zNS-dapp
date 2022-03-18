import { ethers } from 'ethers';

const mockAssets = [
	{
		asset: {
			name: 'Ethereum',
			ticker: 'ETH',
			image:
				'https://res.cloudinary.com/fact0ry/image/upload/c_fit,h_100,q_60,w_100/v1/zns/QmPtAcgQFvzXHpteRUED7chUpkHK9qZ94LPumFLBJhfk1K',
		},
		quantity: 88000,
		value: ethers.BigNumber.from('60913038'),
	},
	{
		asset: {
			name: 'Wilder World',
			ticker: 'WILD',
			image:
				'https://res.cloudinary.com/fact0ry/image/upload/c_fit,h_100,q_60,w_100/v1/zns/QmPtAcgQFvzXHpteRUED7chUpkHK9qZ94LPumFLBJhfk1K',
		},
		quantity: 38000,
		value: ethers.BigNumber.from('48654127'),
	},
	{
		asset: {
			name: 'Infinity',
			ticker: 'III',
			image:
				'https://res.cloudinary.com/fact0ry/image/upload/c_fit,h_100,q_60,w_100/v1/zns/QmPtAcgQFvzXHpteRUED7chUpkHK9qZ94LPumFLBJhfk1K',
		},
		quantity: 22000,
		value: ethers.BigNumber.from('50774703'),
	},
	{
		asset: {
			name: 'Wheel 1',
			ticker: 'wilder.genesis',
			image:
				'https://res.cloudinary.com/fact0ry/image/upload/c_fit,h_100,q_60,w_100/v1/zns/QmPtAcgQFvzXHpteRUED7chUpkHK9qZ94LPumFLBJhfk1K',
		},
		quantity: 1,
		value: ethers.BigNumber.from('49710'),
	},
];

const mock = {
	mockAssets,
};
export default mock;
