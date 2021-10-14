/* eslint-disable react-hooks/exhaustive-deps */
import { FutureButton, Spinner } from 'components';
import React, { useEffect, useState } from 'react';

import styles from './SubdomainTableCard.module.css';

import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';
import { useBidProvider } from 'lib/providers/BidProvider';
import { Bid } from 'lib/types';
import { useHistory } from 'react-router-dom';

import { NFTCard } from 'components';

import { useBid } from './BidProvider';

const SubdomainTableCard = (props: any) => {
	const walletContext = useWeb3React<Web3Provider>();
	const { account } = walletContext;
	const { push: goTo } = useHistory();
	const { makeABid, updated } = useBid();

	const { getBidsForDomain } = useBidProvider();

	const domain = props.data;

	const [bids, setBids] = useState<Bid[] | undefined>();
	const [hasUpdated, setHasUpdated] = useState<boolean>(false);
	const [areBidsLoading, setAreBidsLoading] = useState<boolean>(true);

	const isOwnedByUser =
		account?.toLowerCase() === domain?.owner?.id.toLowerCase();

	const onButtonClick = (event: any) => {
		makeABid(domain);
	};

	useEffect(() => {
		if (updated && updated.id === domain.id) {
			setHasUpdated(!hasUpdated);
		}
	}, [updated]);

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
	}, [domain, hasUpdated]);

	const onClick = (event: any) => {
		if (!event.target.className.includes('FutureButton')) {
			goTo(domain.name.split('wilder.')[1]);
		}
	};

	return (
		<NFTCard
			domain={domain.name}
			metadataUrl={domain.metadata}
			nftOwnerId={domain.owner?.id || ''}
			nftMinterId={domain.minter?.id || ''}
			showCreator
			showOwner
			onClick={onClick}
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
				<FutureButton
					glow={account !== undefined && !isOwnedByUser}
					onClick={onButtonClick}
				>
					Bid
				</FutureButton>
			</div>
		</NFTCard>
	);
};

export default React.memo(SubdomainTableCard);
