/* eslint-disable react-hooks/exhaustive-deps */
// React Imports
import { useState, useEffect, useRef } from 'react';

// Library Imports
import { Domain, DomainData } from 'lib/types';
import { useBid } from 'lib/hooks/useBid';

// Component Imports
import { Spinner } from 'components';
import ViewBids from './ViewBids';

// Style Imports
import styles from './NFTCardActions.module.scss';

type NFTCardActionsProps = {
	filterOwnBids?: boolean;
	domain: Domain;
	onButtonClick?: (domain: DomainData) => void;
	onLoad?: () => void;
};

const NFTCardActions: React.FC<NFTCardActionsProps> = ({
	domain,
	filterOwnBids,
	onButtonClick,
	onLoad,
}) => {
	const { getBidsForDomain } = useBid();

	let isMounted = useRef(false);

	const [highestBid, setHighestBid] = useState<number | undefined>();
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const getBids = async () => {
		const bids = await getBidsForDomain(domain);

		if (isMounted.current === false) return;

		setIsLoading(false);

		if (!bids) return;

		setHighestBid(bids[0]?.amount || 0);

		if (onLoad) onLoad();
	};

	useEffect(() => {
		isMounted.current = true;
		setIsLoading(true);
		getBids();
		return () => {
			isMounted.current = false;
		};
	}, [domain]);

	const bidText = () => {
		if (highestBid !== undefined) {
			if (highestBid > 0) return `${highestBid?.toLocaleString()} WILD`;
			else return 'No bids';
		} else {
			return 'Failed to retrieve';
		}
	};

	return (
		<div className={styles.Container}>
			<div className={styles.Bid}>
				{isLoading && <Spinner style={{ marginTop: 1 }} />}
				{!isLoading && (
					<>
						<label>Highest Bid</label>
						<span className="glow-text-blue">{bidText()}</span>
					</>
				)}
			</div>
			{onButtonClick && (
				<ViewBids
					style={{ marginLeft: 'auto', textTransform: 'uppercase' }}
					domain={domain}
					onClick={onButtonClick}
					filterOwnBids={filterOwnBids}
				/>
			)}
		</div>
	);
};

export default NFTCardActions;
