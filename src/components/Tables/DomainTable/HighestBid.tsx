import { useState, useEffect, useRef } from 'react';

import { useBidProvider } from 'lib/providers/BidProvider';

import { Spinner } from 'components';

import { Domain } from 'lib/types';

type HighestBidProps = {
	domain: Domain;
};

const HighestBid: React.FC<HighestBidProps> = ({ domain }) => {
	let isMounted = useRef(false);
	const { getBidsForDomain } = useBidProvider();
	const [highestBid, setHighestBid] = useState<number | undefined>();
	const [didApiCallFail, setDidApiCallFail] = useState<boolean>(false);

	const getBids = async () => {
		const bids = await getBidsForDomain(domain);
		if (!isMounted.current) return;
		if (!bids) setDidApiCallFail(true);
		else if (bids.length === 0) setHighestBid(0);
		else setHighestBid(bids[0].amount);
	};

	useEffect(() => {
		isMounted.current = true;
		getBids();
		return () => {
			isMounted.current = false;
		};
	}, []);

	return (
		<>
			{didApiCallFail && <>Failed to retrieve</>}
			{highestBid === 0 && <>-</>}
			{highestBid !== undefined && highestBid > 0 && <>{highestBid} WILD</>}
			{highestBid === undefined && !didApiCallFail && (
				<Spinner style={{ marginLeft: 'auto' }} />
			)}
		</>
	);
};

export default HighestBid;
