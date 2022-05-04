//- Constants Imports
import { MESSAGES } from './MintPreview.constants';

export const MAX_CHARACTER_VALUE = 28;

export const getPreviewPrompt = (isTxCompleted: boolean) =>
	isTxCompleted ? MESSAGES.MINTING_COMPLETED : MESSAGES.MINTING_IN_PROGRESS;
