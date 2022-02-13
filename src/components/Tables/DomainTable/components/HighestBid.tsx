/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from 'react';

import { useBid } from 'lib/hooks/useBid';

import { Spinner } from 'components';

import { Domain } from 'lib/types';

type HighestBidProps = {
	domain: Domain;
	refreshKey: string;
};

const HighestBid: React.FC<HighestBidProps> = ({ domain, refreshKey }) => {
	let isMounted = useRef(false);
	const { getBidsForDomain } = useBid();
	const [highestBid, setHighestBid] = useState<number | undefined>();
	const [didApiCallFail, setDidApiCallFail] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const getBids = async () => {
		const bids = await getBidsForDomain(domain);
		if (!isMounted.current) {
			return;
		}

		setIsLoading(false);

		if (!bids) {
			setDidApiCallFail(true);
			return;
		}

		if (bids.length === 0) {
			setHighestBid(0);
		} else {
			setHighestBid(bids[0].amount);
		}
	};

	useEffect(() => {
		isMounted.current = true;
		setIsLoading(true);
		getBids();
		return () => {
			isMounted.current = false;
		};
	}, [domain]);

	useEffect(() => {
		if (refreshKey === domain.id) {
			setIsLoading(true);
			getBids();
		}
	}, [refreshKey]);

	let displayElement: React.ReactFragment = <></>;

	if (isLoading) {
		displayElement = <Spinner style={{ marginLeft: 'auto' }} />;
	} else if (didApiCallFail) {
		displayElement = <>Failed to retrieve</>;
	} else if (highestBid === 0) {
		displayElement = <>-</>;
	} else if (highestBid && highestBid > 0) {
		displayElement = <>{highestBid.toLocaleString()} WILD</>;
	}

	return <>{displayElement}</>;
};

export default HighestBid;
