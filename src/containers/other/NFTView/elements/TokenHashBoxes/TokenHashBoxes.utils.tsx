import { TOOLTIP, STATUS, STATUS_TEXT } from './TokenHashBoxes.constants';

export const getTooltipText = (isClaimed: boolean) =>
	isClaimed ? TOOLTIP[STATUS.CLAIMED] : TOOLTIP[STATUS.CLAIM];

export const getStatusText = (isClaimed: boolean) =>
	isClaimed ? STATUS_TEXT[STATUS.CLAIMED] : STATUS_TEXT[STATUS.CLAIM];
