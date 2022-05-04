//- React Imports
import { useMemo, useCallback } from 'react';

//- Library Imports
import { useCurrentDomain } from 'lib/providers/CurrentDomainProvider';
import useNotification from 'lib/hooks/useNotification';

//- Constants Imports
import { MESSAGES } from '../NFTView.constants';

//- Helper Imports
import {
	getDomainAsset,
	downloadDomainAsset,
	shareDomainAsset,
} from '../NFTView.helpers';

//- Hook level type definitions
interface useAssetsReturn {
	downloadAsset: () => Promise<void>;
	shareAsset: () => Promise<void>;
}

export const useAsset = (): useAssetsReturn => {
	//- Current domain
	const { domain: znsDomain, domainRaw: domain } = useCurrentDomain();

	//- Notification
	const { addNotification } = useNotification();

	//- Memoized data
	const domainAssetURL = useMemo(() => {
		return (
			znsDomain?.animation_url || znsDomain?.image_full || znsDomain?.image
		);
	}, [znsDomain]);

	//- Callback functions

	const downloadAsset = useCallback(async () => {
		if (!domainAssetURL) {
			return;
		}

		try {
			const asset = await getDomainAsset(domainAssetURL);
			if (asset) {
				addNotification(MESSAGES.DOWNLOAD, 1000);
				try {
					await downloadDomainAsset(asset);
					// Set timeout to prevent overlapping notifications
					setTimeout(() => {
						addNotification(MESSAGES.DOWNLOAD_SUCCESSFUL);
					}, 1500);
				} catch (e) {
					console.error(e);
					addNotification(MESSAGES.DOWNLOAD_ERROR);
				}
			}
		} catch (e) {
			console.error(e);
			addNotification(MESSAGES.ASSET_ERROR);
		}
	}, [domainAssetURL, addNotification]);

	//- Opens share
	const shareAsset = useCallback(async () => {
		if (domain) {
			shareDomainAsset(domain);
		}
	}, [domain]);

	return {
		downloadAsset,
		shareAsset,
	};
};

export default useAsset;
