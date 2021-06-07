import React from 'react';

import { useZnsContracts } from 'lib/contracts';
import useNotification from 'lib/hooks/useNotification';
import { createDomainMetadata, uploadToIPFS } from 'lib/utils';
import { DomainRequestContents, NftParams } from 'lib/types';
import { ethers } from 'ethers';

export const StakingContext = React.createContext({
	request: async (domainRequest: DomainRequestParams) => {},
});

type StakingProviderType = {
	children: React.ReactNode;
};

export interface DomainRequestParams {
	requestor: string;
	stakeAmount: string;
	nft: NftParams;
}

const StakingProvider: React.FC<StakingProviderType> = ({ children }) => {
	const { addNotification } = useNotification();
	const stakingController = useZnsContracts()?.stakingController;

	const request = async (params: DomainRequestParams) => {
		if (!stakingController) {
			console.error(`no controller`);
			return;
		}

		const userHasSubmitted = new Promise<void>((resolve, reject) => {
			const doRequest = async () => {
				try {
					// Create the intended metadata
					const intendedMetadata = await createDomainMetadata({
						image: params.nft.image,
						name: params.nft.name,
						story: params.nft.story,
					});

					// Upload the request data to IPFS
					const fullRequestData: DomainRequestContents = {
						parent: params.nft.parent,
						domain: params.nft.domain,
						requestor: params.requestor,
						stakeAmount: params.stakeAmount,
						metadata: intendedMetadata,
						locked: params.nft.locked,
					};
					const domainRequestUri = await uploadToIPFS(
						JSON.stringify(fullRequestData),
					);

					// Convert to wei (assumes 18 decimals places on token)
					const offeredAmountInWei = ethers.utils.parseEther(
						params.stakeAmount,
					);

					// Place the request for the domain
					const tx = await stakingController.placeDomainRequest(
						params.nft.parent,
						offeredAmountInWei,
						params.nft.name,
						domainRequestUri,
					);

					resolve();

					addNotification(`Submitting request for ${params.nft.name}`);
					await tx.wait();
					addNotification(`Request for ${params.nft.name} submitted`);
				} catch (e) {
					if (e.message || e.data) {
						console.error(`failed to request: ${e.data} : ${e.message}`);
					}
					console.error(e);

					addNotification(
						'Encountered an error while attempting to request a domain.',
					);

					reject();
				}
			};

			doRequest();
		});

		return userHasSubmitted;
	};

	const acceptRequest = async () => {};

	const contextValue = {
		request,
	};

	return (
		<StakingContext.Provider value={contextValue}>
			{children}
		</StakingContext.Provider>
	);
};
