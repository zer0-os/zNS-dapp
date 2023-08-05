import { STATUS, STATUS_TEXT, TOOLTIP } from './TokenHashBoxes.constants';

export const getTooltipText = (isClaimable?: boolean) =>
	isClaimable ? TOOLTIP[STATUS.CLAIM] : TOOLTIP[STATUS.CLAIMED];

export const getStatusText = (isClaimable?: boolean) =>
	isClaimable ? STATUS_TEXT[STATUS.CLAIM] : STATUS_TEXT[STATUS.CLAIMED];
