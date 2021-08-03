import { useState, useEffect } from 'react';

import { useBidProvider } from 'lib/providers/BidProvider';

import { Spinner } from 'components';

import { Bid, Domain } from 'lib/types';

type HighestBidProps = {
	domain: Domain;
};

const HighestBid: React.FC<HighestBidProps> = ({ domain }) => {
	const { getBidsForDomain } = useBidProvider();
	const [highestBid, setHighestBid] = useState<Bid | undefined>();

	const getBids = async () => {
		const bids = await getBidsForDomain(domain);
		if (!bids || bids.length === 0) return;
		setHighestBid(bids[0]);
	};

	useEffect(() => {
		getBids();
	}, []);

	return (
		<>{highestBid?.amount ?? <Spinner style={{ marginLeft: 'auto' }} />}</>
	);
};

export default HighestBid;
