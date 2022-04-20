import { MESSAGES } from './TransferPreview.constants';

export const MAX_CHARACTER_VALUE = 28;

export const getPreviewTitle = (isTxCompleted: boolean) =>
	isTxCompleted
		? MESSAGES.TRANSFER_COMPLETED_TITLE
		: MESSAGES.TRANSFER_PROGRESS_TITLE;

export const getPreviewPrompt = (isTxCompleted: boolean) =>
	isTxCompleted
		? MESSAGES.TRANSFER_COMPLETED_TITLE
		: MESSAGES.TRANSFER_IN_PROGRESS;

export const getPreviewSubtitle = (isTxCompleted: boolean) =>
	isTxCompleted ? MESSAGES.TRANSFERRED_TO : MESSAGES.TRANSFERRING_TO;
