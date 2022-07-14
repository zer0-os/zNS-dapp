//- Constants Imports
import { MESSAGES, LABELS } from 'containers/flows/ClaimNFT/ClaimNFT.constants';
import { BUTTONS, TOOLTIP, TEXT_INPUT } from './Details.constants';
import { BigNumber } from 'ethers';

// Validation
export const isValidTokenId = (text: string) => {
	try {
		const hexString = BigNumber.from(text).toHexString();
		console.log('is valid?', /^0x[a-fA-F0-9]{64}$/.test(hexString));
		return /^0x[a-fA-F0-9]{64}$/.test(hexString);
	} catch (e) {
		return false;
	}
};

export const isValid = (tokenID: string) => isValidTokenId(tokenID);

export const getButtonText = (isConnected: boolean, isClaimable: boolean) => {
	if (!isConnected) {
		return BUTTONS.CONNECT_WALLET;
	} else if (isConnected && isClaimable) {
		return BUTTONS.START_CLAIMING;
	} else {
		return BUTTONS.BUY_WHEELS;
	}
};

export const getQuantityText = (total: number) =>
	total > 0
		? `${MESSAGES.APPEND_CLAIMABLE_TEXT} ${total} ${LABELS.MOTOS}`
		: `${total} ${MESSAGES.APPEND_UNCLAIMABLE_TEXT}`;

export const getQuantityTooltip = (isClaimable: boolean) =>
	isClaimable ? `${TOOLTIP.CLAIMABLE}` : `${TOOLTIP.UNCLAIMABLE}`;

export enum NotificationType {
	SUCCESS = 'SUCCESS',
	ERROR = 'ERROR',
	NULL = 'NULL',
}

export const handleInputNotification = (
	setInputNotification: (text: string) => void,
	setNotificationType: (type: NotificationType) => void,
	tokenClaimable?: boolean,
	isValidSubdomain?: boolean,
) => {
	if (!isValidSubdomain) {
		setInputNotification(TEXT_INPUT.INVALID_SUBDOMAIN);
		setNotificationType(NotificationType.ERROR);
	} else {
		if (tokenClaimable) {
			setInputNotification(TEXT_INPUT.CLAIM_CONSUMED_SUCCESS);
			setNotificationType(NotificationType.SUCCESS);
		} else if (tokenClaimable === undefined) {
			setInputNotification('');
			setNotificationType(NotificationType.NULL);
		} else {
			setInputNotification(TEXT_INPUT.CLAIM_CONSUMED_ERROR);
			setNotificationType(NotificationType.ERROR);
		}
	}
};
