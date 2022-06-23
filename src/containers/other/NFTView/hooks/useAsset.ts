//- React Imports
import { useCallback } from 'react';

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
	downloadAsset: (assetUrl: string) => Promise<void>;
	shareAsset: () => Promise<void>;
}

export const useAsset = (): useAssetsReturn => {
	//- Current domain
	const { domainRaw: domain } = useCurrentDomain();

	//- Notification
	const { addNotification } = useNotification();

	//- Callback functions

	const downloadAsset = useCallback(
		async (assetUrl: string) => {
			const asset = await getDomainAsset(assetUrl);

			if (asset) {
				try {
					addNotification(MESSAGES.DOWNLOAD, 1000);

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
		},
		[addNotification],
	);

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
