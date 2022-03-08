import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { IconButton } from 'components';
import arrowForwardIcon from 'assets/arrow-forward.svg';
import arrowBackIcon from 'assets/arrow-back.svg';
import {
	useHistoryButtonsData,
	useHistoryButtonsHandlers,
	useHistoryButtonsLifecycle,
} from './hooks';
import './_history-buttons.scss';

export const HistoryButtons: React.FC = () => {
	const history = useHistory();
	const { pathname } = useLocation();

	const { localState, localActions, formattedData, refs } =
		useHistoryButtonsData({ props: { pathname } });

	const handlers = useHistoryButtonsHandlers({
		props: {
			pathname,
			history,
		},
		localState,
		localActions,
		refs,
	});

	useHistoryButtonsLifecycle({ props: { pathname }, handlers });

	return (
		<div className="history-buttons__container">
			<IconButton
				iconUri={arrowBackIcon}
				onClick={handlers.handleOnBackClick}
				className="history-buttons__button"
				disabled={!formattedData.canGoBack}
				alt="Click to go back"
			/>
			<IconButton
				iconUri={arrowForwardIcon}
				onClick={handlers.handleOnForwardClick}
				className="history-buttons__button"
				disabled={!formattedData.canGoForward}
				alt="Click to go forward"
			/>
		</div>
	);
};

export default HistoryButtons;
