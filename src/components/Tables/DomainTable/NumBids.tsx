import { useState, useEffect, useRef } from 'react';

import { useBidProvider } from 'lib/providers/BidProvider';

import { Spinner } from 'components';

import { Domain } from 'lib/types';

type NumBidsProps = {
	domain: Domain;
};

const NumBids: React.FC<NumBidsProps> = ({ domain }) => {
	let isMounted = useRef(false);
	const { getBidsForDomain } = useBidProvider();
	const [numBids, setNumBids] = useState<number | undefined>();
	const [didApiCallFail, setDidApiCallFail] = useState<boolean>(false);

	const getBids = async () => {
		const bids = await getBidsForDomain(domain);
		if (!isMounted.current) return;
		if (!bids) setDidApiCallFail(true);
		else setNumBids(bids.length);
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
			{numBids && <>{numBids}</>}
			{numBids === undefined && !didApiCallFail && (
				<Spinner style={{ marginLeft: 'auto' }} />
			)}
		</>
	);
};

export default NumBids;
