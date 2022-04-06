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

		const asset = await getDomainAsset(domainAssetURL);

		if (asset) {
			addNotification(MESSAGES.DOWNLOAD);

			await downloadDomainAsset(asset);
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
