import { ethers } from 'ethers';
import { DAO } from './DAOList.types';

export const mockDAOs: DAO[] = [
	{
		id: '1',
		icon: 'https://res.cloudinary.com/fact0ry/image/upload/c_fit,h_100,q_60,w_100/v1/zns/QmPtAcgQFvzXHpteRUED7chUpkHK9qZ94LPumFLBJhfk1K',
		name: 'Wilder DAO',
		zna: 'wilder.dao',
		value: ethers.BigNumber.from('160913038'),
		holders: 53215,
	},
	{
		id: '2',
		icon: 'https://res.cloudinary.com/fact0ry/image/upload/c_fit,h_100,q_60,w_100/v1/zns/QmPtAcgQFvzXHpteRUED7chUpkHK9qZ94LPumFLBJhfk1K',
		name: 'Wheels DAO',
		zna: 'wilder.dao.wheels',
		value: ethers.BigNumber.from('48654127'),
		holders: 93241,
	},
];
