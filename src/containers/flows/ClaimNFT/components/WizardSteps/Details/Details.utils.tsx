//- Constants Imports
import { MESSAGES, LABELS } from 'containers/flows/ClaimNFT/ClaimNFT.constants';
import { BUTTONS, TOOLTIP, TEXT_INPUT } from './Details.constants';

// Validation
export const isValidTokenId = (text: string) =>
	// good enough tokenID validation ?
	/^0x[a-fA-F0-9]{64}$/.test(String(text).toLowerCase());

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
		} else if (tokenClaimable === false) {
			setInputNotification(TEXT_INPUT.CLAIM_CONSUMED_ERROR);
			setNotificationType(NotificationType.ERROR);
		} else if (tokenClaimable === undefined) {
			setInputNotification(TEXT_INPUT.UNABLE_TO_RETRIEVE);
			setNotificationType(NotificationType.ERROR);
		} else {
			return;
		}
	}
};
