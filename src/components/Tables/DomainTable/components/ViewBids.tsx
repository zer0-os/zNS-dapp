import { useState, useEffect, useRef } from 'react';

import { useBidProvider } from 'lib/providers/BidProvider';

import { Bid, Domain, DomainData } from 'lib/types';
import FutureButton from 'components/Buttons/FutureButton/FutureButton';

type ViewBidsProps = {
	domain: Domain;
	onClick: (domain: DomainData) => void;
	style?: React.CSSProperties;
	filterOwnBids?: boolean;
};

const ViewBids: React.FC<ViewBidsProps> = ({
	domain,
	onClick,
	style,
	filterOwnBids,
}) => {
	let isMounted = useRef(false);

	const { getBidsForDomain } = useBidProvider();
	const [bids, setBids] = useState<Bid[] | undefined>();
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const handleClick = () => {
		if (!isLoading && bids !== undefined) {
			onClick({
				domain,
				bids,
			});
		}
	};

	const getBids = async () => {
		const bids = await getBidsForDomain(domain, filterOwnBids);
		if (!isMounted.current) return;
		setIsLoading(false);
		if (bids && bids.length) setBids(bids);
	};

	useEffect(() => {
		isMounted.current = true;
		setIsLoading(true);
		getBids();
		return () => {
			isMounted.current = false;
		};
	}, [domain]);

	return (
		<>
			{bids !== undefined && bids.length > 0 && (
				<FutureButton
					onClick={handleClick}
					glow={!isLoading && bids !== undefined}
					style={style}
				>
					View Bids
				</FutureButton>
			)}
			{bids === undefined && (
				<div style={{ textAlign: 'right', marginRight: '48px' }}>no bids</div>
			)}
		</>
	);
};

export default ViewBids;
