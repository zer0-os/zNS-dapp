//- Constants Imports
import { MESSAGES, LABELS } from 'containers/flows/ClaimNFT/ClaimNFT.constants';
import { BUTTONS, TOOLTIP } from './Details.constants';

// Validation
export const isValidTokenId = (text: string) =>
	// good enough tokenID validation ?
	/^0x[a-fA-F0-9]{66}$/.test(String(text).toLowerCase());

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

export const getQuantityText = (isClaimable: boolean, total: number) =>
	isClaimable
		? `${MESSAGES.APPEND_CLAIMABLE_TEXT} ${total} ${LABELS.MOTOS}`
		: `${total} ${MESSAGES.APPEND_UNCLAIMABLE_TEXT}`;

export const getQuantityTooltip = (isClaimable: boolean) =>
	isClaimable ? `${TOOLTIP.CLAIMABLE}` : `${TOOLTIP.UNCLAIMABLE}`;
