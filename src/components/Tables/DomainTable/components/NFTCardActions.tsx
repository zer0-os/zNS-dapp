// React Imports
import { useState, useEffect, useRef } from 'react';

// Library Imports
import { Domain } from 'lib/types';
import { useBidProvider } from 'lib/providers/BidProvider';

// Component Imports
import { FutureButton, Spinner } from 'components';

// Style Imports
import styles from './NFTCardActions.module.css';

type NFTCardActionsProps = {
	disableButton?: boolean;
	domain: Domain;
	hideButton?: boolean;
	onButtonClick: (domain: Domain) => void;
	onLoad?: () => void;
};

const NFTCardActions: React.FC<NFTCardActionsProps> = ({
	disableButton,
	domain,
	hideButton,
	onButtonClick,
	onLoad,
}) => {
	const { getBidsForDomain } = useBidProvider();

	let isMounted = useRef(false);
	const [highestBid, setHighestBid] = useState<number | undefined>();
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const buttonClick = () => {
		onButtonClick(domain);
	};

	const getBids = async () => {
		const bids = await getBidsForDomain(domain);

		if (isMounted.current === false) return;

		setIsLoading(false);

		if (!bids) {
			return;
		}

		if (bids.length === 0) {
			setHighestBid(0);
		} else {
			setHighestBid(bids[0].amount);
		}

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

	return (
		<div className={styles.Container}>
			<div className={styles.Bid}>
				{isLoading && <Spinner style={{ marginTop: 1 }} />}
				{!isLoading && (
					<>
						<label>Highest Bid</label>
						<span className="glow-text-blue">
							{highestBid !== undefined &&
								highestBid > 0 &&
								`${highestBid?.toLocaleString()} WILD`}
							{highestBid !== undefined && highestBid === 0 && 'No bids'}
							{highestBid === undefined && 'Failed to retrieve'}
						</span>
					</>
				)}
			</div>
			{!hideButton && (
				<FutureButton glow={!disableButton} onClick={buttonClick}>
					Make A Bid
				</FutureButton>
			)}
		</div>
	);
};

export default NFTCardActions;
