import { zDAO } from '@zero-tech/zdao-sdk';
import { TABLE_KEYS } from './DAOTable.constants';

export type DAOTableDataItem = {
	[TABLE_KEYS.TITLE]: string;
	[TABLE_KEYS.ZNA]: string;
	[TABLE_KEYS.DAO]: zDAO;
};
