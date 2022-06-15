import { INPUT, WARNINGS } from './Claiming.constants';

export const maxQuantityLimit = 50;

export const getPlaceholder = (
	quantity: number,
	exceedsQuantityMintLimit: boolean,
) =>
	`${INPUT.PLACEHOLDER} (${exceedsQuantityMintLimit ? '50' : quantity} ${
		INPUT.APPEND_MAX
	})`;

export const handleInputError = (
	total: string | undefined,
	ownedQuantity: number,
	exceedsQuantityMintLimit: boolean,
	setInputError: (errorText: string) => void,
) => {
	if (exceedsQuantityMintLimit && Number(total) > maxQuantityLimit) {
		setInputError(WARNINGS.INPUT_EXCEED_MINT_LIMIT);
	} else if (Number(total) > ownedQuantity) {
		setInputError(WARNINGS.INPUT_EXCEED_OWNED_QUANTITY + String(ownedQuantity));
	} else {
		return;
	}
};
