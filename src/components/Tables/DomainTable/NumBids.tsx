import { useState, useEffect } from 'react';

import { useBidProvider } from 'lib/providers/BidProvider';

import { Spinner } from 'components';

import { Domain } from 'lib/types';

type NumBidsProps = {
	domain: Domain;
};

const NumBids: React.FC<NumBidsProps> = ({ domain }) => {
	const { getBidsForDomain } = useBidProvider();
	const [numBids, setNumBids] = useState<number | undefined>();

	const getBids = async () => {
		const bids = await getBidsForDomain(domain);
		if (!bids || bids.length === 0) return;
		setNumBids(bids.length);
	};

	useEffect(() => {
		getBids();
	}, []);

	return <>{numBids ?? <Spinner style={{ marginLeft: 'auto' }} />}</>;
};

export default NumBids;
