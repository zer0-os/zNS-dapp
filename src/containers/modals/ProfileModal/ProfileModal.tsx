import React, { useReducer } from 'react';
import { Overlay, Profile } from 'components';
import { useHistory, useLocation } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import { Domain } from 'lib/types';
import { SetBuyPriceWizard } from 'containers';

type SetPriceState = {
	domain?: Domain;
	isSetPriceWizardOpened: boolean;
};

type SetPriceAction =
	| { type: 'openSetPriceWizard'; domain: Domain }
	| { type: 'closeSetPriceWizard' };

function setPriceReducer(
	state: SetPriceState,
	action: SetPriceAction,
): SetPriceState {
	switch (action.type) {
		case 'openSetPriceWizard':
			return { isSetPriceWizardOpened: true, domain: action.domain };
		case 'closeSetPriceWizard':
			return { isSetPriceWizardOpened: false };
	}
}

export const SetBuyPriceContext =
	React.createContext<React.Dispatch<SetPriceAction> | null>(null);

const ProfileModal = () => {
	const history = useHistory();
	const location = useLocation();
	const { account } = useWeb3React();
	const params = new URLSearchParams(location.search);

	const [{ isSetPriceWizardOpened, domain }, dispatch] = useReducer(
		setPriceReducer,
		{
			isSetPriceWizardOpened: false,
		},
	);
	const closeModal = () => {
		dispatch({ type: 'closeSetPriceWizard' });
		params.delete('profile');
		history.push({
			pathname: location.pathname,
			search: params.toString(),
		});
	};

	const onNavigate = (to: string) => {
		dispatch({ type: 'closeSetPriceWizard' });
		params.delete('profile');
		history.push({
			pathname: to,
			search: params.toString(),
		});
	};

	if (params.get('profile') && account !== undefined) {
		return (
			<Overlay fullScreen centered open onClose={closeModal}>
				<SetBuyPriceContext.Provider value={dispatch}>
					{isSetPriceWizardOpened && domain ? (
						<SetBuyPriceWizard
							domain={domain}
							cancelHandler={closeModal}
							successHandler={closeModal}
						/>
					) : (
						<Profile yours id={account!} onNavigate={onNavigate} />
					)}
				</SetBuyPriceContext.Provider>
			</Overlay>
		);
	}
	return <></>;
};

export default ProfileModal;
