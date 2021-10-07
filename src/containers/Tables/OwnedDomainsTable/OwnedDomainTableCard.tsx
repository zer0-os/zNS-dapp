/* eslint-disable react-hooks/exhaustive-deps */
import { Spinner } from 'components';
import React, { useEffect, useState } from 'react';

import styles from './OwnedDomainTableCard.module.css';
import { useBidProvider } from 'lib/providers/BidProvider';
import { Bid } from 'lib/types';
import { NFTCard } from 'components';
import { useTableProvider } from './OwnedDomainTableProvider';

const OwnedDomainTableCard = (props: any) => {
	const { getBidsForDomain } = useBidProvider();

	const domain = props.data;
	const [bids, setBids] = useState<Bid[] | undefined>();
	const [areBidsLoading, setAreBidsLoading] = useState<boolean>(true);
	const { rowClick } = useTableProvider();

	useEffect(() => {
		let isMounted = true;
		const get = async () => {
			setAreBidsLoading(true);
			setBids(undefined);
			const b = await getBidsForDomain(domain);
			if (isMounted) {
				setAreBidsLoading(false);
				setBids(b);
			}
		};
		get();
		return () => {
			isMounted = false;
		};
	}, [domain]);

	return (
		<NFTCard
			domain={domain.name}
			metadataUrl={domain.metadata}
			nftOwnerId={domain.owner?.id || ''}
			nftMinterId={domain.minter?.id || ''}
			showCreator
			showOwner
			onClick={(e) => rowClick(domain)}
		>
			<div className={styles.Container}>
				<div className={styles.Bid}>
					{areBidsLoading && <Spinner style={{ marginTop: 1 }} />}
					{!areBidsLoading && (
						<>
							<label>Highest Bid</label>
							<span className="glow-text-blue">
								{bids &&
									bids.length > 0 &&
									bids[0].amount.toLocaleString() + ' WILD'}
								{bids && bids.length === 0 && 'No bids'}
								{!bids && 'Failed to retrieve'}
							</span>
						</>
					)}
				</div>
			</div>
		</NFTCard>
	);
};

export default React.memo(OwnedDomainTableCard);
