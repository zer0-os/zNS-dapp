import { INPUT, WARNINGS } from './Claiming.constants';

export const maxQuantityLimit = 10;

export const getPlaceholder = (
	quantity: number,
	exceedsQuantityMintLimit: boolean,
) =>
	`${INPUT.PLACEHOLDER} (${exceedsQuantityMintLimit ? 'X' : quantity} ${
		INPUT.APPEND_MAX
	})`;

export const handleInputError = (
	total: string,
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
