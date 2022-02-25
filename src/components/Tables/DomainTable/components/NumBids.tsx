/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from 'react';

import { useBidProvider } from 'lib/hooks/useBidProvider';

import { Spinner } from 'components';

import { Domain } from 'lib/types';

type NumBidsProps = {
	domain: Domain;
	refreshKey: string;
	filterOwnBids?: boolean;
};

const NumBids: React.FC<NumBidsProps> = ({
	domain,
	refreshKey,
	filterOwnBids,
}) => {
	let isMounted = useRef(false);
	const { getBidsForDomain } = useBidProvider();
	const [numBids, setNumBids] = useState<number | undefined>();
	const [didApiCallFail, setDidApiCallFail] = useState<boolean>(false);

	const [isLoading, setIsLoading] = useState<boolean>(true);

	const getBids = async () => {
		const bids = await getBidsForDomain(domain, filterOwnBids);

		if (!isMounted.current) return;

		setIsLoading(false);

		if (!bids) {
			setDidApiCallFail(true);
			return;
		}

		setNumBids(bids.length);
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
	} else {
		displayElement = <>{numBids?.toLocaleString() || 0}</>;
	}

	return <>{displayElement}</>;
};

export default NumBids;
