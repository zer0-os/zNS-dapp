import { INPUT } from './Claiming.constants';

export const getPlaceholder = (quantity: number) =>
	`${INPUT.PLACEHOLDER} (${quantity} ${INPUT.APPEND_MAX})`;
