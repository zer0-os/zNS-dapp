// React Imports
import { useState } from 'react';

// Library Imports
import { useCurrentDomain } from 'lib/providers/CurrentDomainProvider';
import { useWeb3React } from '@web3-react/core';

// Component Imports
import { PreviewCard, Overlay } from 'components';
import { MakeABid } from 'containers';

const CurrentDomainPreview = (props: any) => {
	//////////////////
	// State & Data //
	//////////////////

	const { domain } = useCurrentDomain();
	const { account } = useWeb3React();

	// Both variables current hardcoded for Wilder World
	const domainName = domain?.name.split('wilder.')[1];
	const isRootDomain = domain?.name === 'wilder';
	const isDisabled =
		!account || account.toLowerCase() === domain?.owner?.id.toLowerCase();

	const [isBidModalOpen, setIsBidModalOpen] = useState(false);

	const openBidModal = () => {
		setIsBidModalOpen(true);
	};

	const closeBidModal = () => {
		setIsBidModalOpen(false);
	};

	return (
		<>
			{isBidModalOpen && domain && (
				<Overlay onClose={closeBidModal} open={isBidModalOpen}>
					<MakeABid domain={domain} onBid={closeBidModal} />
				</Overlay>
			)}
			<PreviewCard
				domain={domainName || ''}
				metadataUrl={!isRootDomain ? domain?.metadata : ''}
				creatorId={domain?.minter?.id || ''}
				ownerId={domain?.owner?.id || ''}
				disabled={isDisabled}
				mvpVersion={1}
				onButtonClick={openBidModal}
				onImageClick={() => {}}
				preventInteraction={isRootDomain}
			/>
		</>
	);
};

export default CurrentDomainPreview;
