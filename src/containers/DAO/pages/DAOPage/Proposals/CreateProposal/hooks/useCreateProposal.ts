import { useState, useMemo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';
import type { zDAO } from '@zero-tech/zdao-sdk';
import { useDidMount } from 'lib/hooks/useDidMount';
import { useWillUnmount } from 'lib/hooks/useWillUnmount';
import { getTokenOptionsFromAssets } from '../CreateProposal.helpers';
import { DAO_CREATE_PROPPAL } from '../../../Proposals/Proposals.constants';
import useAssets from '../../../hooks/useAssets';

export const useCreateProposal = (dao?: zDAO) => {
	const [triggerCancel, setTriggerCancel] = useState<boolean>(false);
	const [showWalletConnectModal, setShowWalletConnectModal] =
		useState<boolean>(false);

	// - Life Cycle
	useDidMount(() => {
		const nav = document.getElementById('dao-page-nav-tabs');
		if (nav) {
			nav.style.display = 'none';
		}
	});

	useWillUnmount(() => {
		const nav = document.getElementById('dao-page-nav-tabs');
		if (nav) {
			nav.style.display = 'block';
		}
	});

	// - Hooks
	const history = useHistory();
	const { active } = useWeb3React<Web3Provider>();
	const { assets, isLoading: isAssetLoading } = useAssets(dao);

	// - Data
	const isLoading = active ? isAssetLoading : false;
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
			`/${DAO_CREATE_PROPPAL}`,
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
		isLoading,
		notes: {
			show:
				!active || (active && !isLoading && tokenDropdownOptions.length === 0),
			ConnectWallet: {
				show: !active,
				onClick: handleShowConnectWallet,
			},
			Token: {
				show: active && !isLoading && tokenDropdownOptions.length === 0,
				onClick: handleGoToDao,
			},
		},
		triggerCancel,
		showWalletConnectModal,
		showForm: active && !isLoading && tokenDropdownOptions.length > 0,
		tokenDropdownOptions,
		handleGoToAllProposals,
		handleHideConnectWallet,
	};
};
