/* eslint-disable react-hooks/exhaustive-deps */
// React Imports
import { useState, useEffect, useRef } from 'react';

// Library Imports
import { Domain } from 'lib/types';
import { useBidProvider } from 'lib/hooks/useBidProvider';

// Component Imports
import { Spinner } from 'components';

// Style Imports
import styles from './NFTCardActions.module.scss';
import { BidButton } from 'containers';

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
			{!hideButton && (
				<BidButton glow={!disableButton} onClick={buttonClick}>
					Make A Bid
				</BidButton>
			)}
		</div>
	);
};

export default NFTCardActions;
