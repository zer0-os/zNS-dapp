import { useState, useMemo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useWeb3 } from 'lib/web3-connection/useWeb3';
import type { zDAO } from '@zero-tech/zdao-sdk';
import { getTokenOptionsFromAssets } from '../CreateProposal.helpers';
import { DAO_CREATE_PROPOSAL } from '../../Proposals.constants';
import useAssets from '../../../hooks/useAssets';
import useBalance from 'lib/hooks/useBalance';

export const useCreateProposal = (dao?: zDAO) => {
	const [triggerCancel, setTriggerCancel] = useState<boolean>(false);
	const [showWalletConnectModal, setShowWalletConnectModal] =
		useState<boolean>(false);

	// - Hooks
	const history = useHistory();
	const { isActive } = useWeb3();
	const { assets, isLoading: isAssetLoading } = useAssets(dao);
	const { balance, isLoading: isLoadingBalance } = useBalance(
		dao?.votingToken.token,
	);

	// - Data
	const isLoading = isActive ? isAssetLoading : false;
	const tokenDropdownOptions = useMemo(
		() => getTokenOptionsFromAssets(assets),
		[assets],
	);

	// - Handlers
	const handleGoToAllProposals = useCallback(
		() => setTriggerCancel(!triggerCancel),
		[triggerCancel, setTriggerCancel],
	);

	const handleGoToDao = useCallback(() => {
		const pathname = history.location.pathname.replace(
			`/${DAO_CREATE_PROPOSAL}`,
			'',
		);
		history.replace(pathname);
	}, [history]);

	const handleShowConnectWallet = useCallback(
		() => setShowWalletConnectModal(true),
		[setShowWalletConnectModal],
	);

	const handleHideConnectWallet = useCallback(
		() => setShowWalletConnectModal(false),
		[setShowWalletConnectModal],
	);

	return {
		isLoading: isLoading || isLoadingBalance,
		notes: {
			show:
				!isActive ||
				(isActive && !isLoading && tokenDropdownOptions.length === 0),
			ConnectWallet: {
				show: !isActive,
				onClick: handleShowConnectWallet,
			},
			Token: {
				show: isActive && !isLoading && tokenDropdownOptions.length === 0,
				onClick: handleGoToDao,
			},
		},
		triggerCancel,
		showWalletConnectModal,
		showForm:
			isActive &&
			!isLoading &&
			tokenDropdownOptions.length > 0 &&
			balance?.gt(0),
		tokenDropdownOptions,
		handleGoToAllProposals,
		handleHideConnectWallet,
		isHoldingVotingToken: balance?.gt(0),
	};
};
