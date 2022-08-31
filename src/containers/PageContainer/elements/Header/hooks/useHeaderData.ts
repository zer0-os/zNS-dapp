import { useState, useRef, useMemo } from 'react';
import { Maybe, DisplayParentDomain, Metadata } from 'lib/types';
import { LOCAL_STORAGE_KEYS } from 'constants/localStorage';
import { MVP_VERSION } from 'constants/mvp';
import {
	REQUEST_TO_MINT,
	MINT_NFT,
} from '../elements/MintButton/MintButton.constants';

type UseHeaderDataProps = {
	props: {
		pageWidth: number;
		znsDomain: Maybe<DisplayParentDomain>;
		domainMetadata: Maybe<Metadata>;
		account: Maybe<string>;
		navbar: {
			title?: string;
			isSearching: boolean;
		};
		mvpVersion: number;
	};
};

type UseHeaderDataReturn = {
	localState: {
		isSearchInputHovered: boolean;
		searchQuery: string;
	};
	localActions: {
		setIsSearchInputHovered: React.Dispatch<React.SetStateAction<boolean>>;
		setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
	};
	formattedData: {
		searchPlaceholder: string;
		mintButtonTitle: string;
		isDesktop: boolean;
		showHistoryButtons: boolean;
		showTitle: boolean;
		showZnaLink: boolean;
		showConnectWalletButton: boolean;
		showMintButton: boolean;
		showStatusButtons: boolean;
		showBuyTokenRedirect: boolean;
		showProfileButton: boolean;
		showInfoButton: boolean;
	};
	refs: {
		searchInputRef: React.RefObject<HTMLInputElement>;
	};
};

export const useHeaderData = ({
	props,
}: UseHeaderDataProps): UseHeaderDataReturn => {
	const searchInputRef = useRef<HTMLInputElement>(null);

	const [isSearchInputHovered, setIsSearchInputHovered] =
		useState<boolean>(false);
	const [searchQuery, setSearchQuery] = useState<string>('');

	const formattedData = useMemo(() => {
		const {
			pageWidth,
			znsDomain,
			domainMetadata,
			account,
			navbar,
			mvpVersion,
		} = props;

		const searchPlaceholder = navbar.isSearching ? 'Type to search' : '';
		const isDesktop = pageWidth > 0;
		const isOwnedByUser =
			znsDomain?.owner?.id.toLowerCase() === account?.toLowerCase();
		const isMintable = Boolean(domainMetadata?.isMintable);
		const isMvpPrototype = mvpVersion === MVP_VERSION;
		const mintButtonTitle = isOwnedByUser ? MINT_NFT : REQUEST_TO_MINT;
		const showHistoryButtons = !Boolean(navbar.title);
		const showTitle = !navbar.isSearching && Boolean(navbar.title);
		const showZnaLink = !navbar.isSearching && !Boolean(navbar.title);
		const showConnectWalletButton = !Boolean(account);
		const showMintButton =
			Boolean(account) &&
			!navbar.isSearching &&
			(isOwnedByUser || (!isOwnedByUser && isMintable)) &&
			isMvpPrototype;
		const showStatusButtons = Boolean(account) && !navbar.isSearching;
		const showBuyTokenRedirect =
			(!Boolean(account) &&
				!Boolean(localStorage.getItem(LOCAL_STORAGE_KEYS.CHOOSEN_WALLET))) ||
			(Boolean(account) && !navbar.isSearching);
		const showProfileButton = Boolean(account);
		const showInfoButton = true;

		return {
			searchPlaceholder,
			mintButtonTitle,
			isDesktop,
			showHistoryButtons,
			showTitle,
			showZnaLink,
			showConnectWalletButton,
			showMintButton,
			showStatusButtons,
			showBuyTokenRedirect,
			showProfileButton,
			showInfoButton,
		};
	}, [props]);

	return {
		localState: {
			isSearchInputHovered,
			searchQuery,
		},
		localActions: {
			setIsSearchInputHovered,
			setSearchQuery,
		},
		formattedData,
		refs: {
			searchInputRef,
		},
	};
};
