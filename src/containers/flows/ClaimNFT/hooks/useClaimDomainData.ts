//- React Imports
import { useState, useEffect, useCallback } from 'react';

//- Library Imports
import { useZnsSdk } from 'lib/hooks/sdk';
import { Domain } from '@zero-tech/zns-sdk/lib/types';

//- Constants Imports
import { MESSAGES } from '../ClaimNFT.constants';

interface UseClaimDomainDataReturn {
	isDomainDataLoading: boolean | undefined;
	domainData: Domain | undefined;
}

const useClaimDomainData = (
	tokenID: string,
	requestCheck: boolean,
): UseClaimDomainDataReturn => {
	const { instance: sdk } = useZnsSdk();
	const [isDomainDataLoading, setIsDomainDataLoading] = useState<boolean>(true);
	const [domainData, setDomainData] = useState<Domain | undefined>();

	const preventCheck = () => {
		setDomainData(undefined);
		setIsDomainDataLoading(false);
	};

	const getDomainData = useCallback(async () => {
		if (!tokenID) {
			return;
		}
		setIsDomainDataLoading(true);

		try {
			const [domainData] = await Promise.all([sdk.getDomainById(tokenID)]);

			setDomainData({
				id: domainData.id,
				name: domainData.name,
				parentId: domainData.parentId,
				owner: domainData.owner,
				minter: domainData.minter,
				metadataUri: domainData.metadataUri,
				isLocked: domainData.isLocked,
				lockedBy: domainData.lockedBy,
				contract: domainData.contract,
				isRoot: domainData.isRoot,
			});
		} catch (e) {
			console.error(MESSAGES.ASSET_ERROR, e);
		} finally {
			setIsDomainDataLoading(false);
		}
	}, [sdk, tokenID]);

	useEffect(() => {
		if (!tokenID || !requestCheck) {
			preventCheck();
		} else if (tokenID && requestCheck) {
			getDomainData();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tokenID, requestCheck]);

	return {
		isDomainDataLoading,
		domainData,
	};
};

export default useClaimDomainData;
