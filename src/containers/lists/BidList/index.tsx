// React Imports
import React, { useCallback, useState } from 'react';

//- Container Imports
import { AcceptBid } from 'containers';

//- Component Imports
import BidList from './BidList';

// Type Imports
import { Bid } from '@zero-tech/zauction-sdk';
import { ConvertedTokenInfo, Domain } from '@zero-tech/zns-sdk';

//- Library Imports
import { Metadata } from 'lib/types';

export type BidListContainerProps = {
	bids: Bid[];
	domain?: Domain;
	domainMetadata?: Metadata;
	onAcceptSuccess?: () => void;
	isLoading?: boolean;
	highestBid?: string;
	paymentTokenInfo: ConvertedTokenInfo;
};

const BidListContainer: React.FC<BidListContainerProps> = ({
	bids,
	domain,
	domainMetadata,
	onAcceptSuccess,
	isLoading,
	highestBid,
	paymentTokenInfo,
}) => {
	//////////////////
	// Data & State //
	//////////////////
	const [isAcceptBidModalOpen, setIsAcceptBidModalOpen] =
		useState<boolean>(false);
	const [isAcceptBidProcessing, setIsAcceptBidProcessing] =
		useState<boolean>(false);
	const [acceptingBid, setAcceptingBid] = useState<Bid | undefined>(undefined);

	///////////////
	// Functions //
	///////////////
	const toggleAcceptBidModal = useCallback(() => {
		setIsAcceptBidModalOpen(!isAcceptBidModalOpen);
	}, [isAcceptBidModalOpen]);

	const handleAcceptBid = (bid: Bid) => {
		if (onAcceptSuccess && !isAcceptBidProcessing) {
			setAcceptingBid(bid);
			toggleAcceptBidModal();
		}
	};

	////////////
	// Render //
	////////////
	return (
		<>
			{isAcceptBidModalOpen && onAcceptSuccess ? (
				// tidy up props
				<AcceptBid
					acceptingBid={acceptingBid}
					domainMetadata={domainMetadata}
					refetch={onAcceptSuccess}
					isLoading={isLoading}
					assetUrl={domainMetadata?.image ?? ''}
					creatorId={domain?.minter ?? ''}
					domainTitle={domainMetadata?.title ?? ''}
					domainName={domain?.name ?? ''}
					walletAddress={acceptingBid?.bidder ?? ''}
					highestBid={highestBid ?? ''}
					onClose={toggleAcceptBidModal}
					paymentTokenInfo={paymentTokenInfo}
					setIsAcceptBidProcessing={setIsAcceptBidProcessing}
				/>
			) : (
				<BidList
					bids={bids}
					paymentTokenInfo={paymentTokenInfo}
					isAcceptBidEnabled
					isAcceptBidProcessing={isAcceptBidProcessing}
					openAcceptBid={handleAcceptBid}
				/>
			)}
		</>
	);
};

export default BidListContainer;
