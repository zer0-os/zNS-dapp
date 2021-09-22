import { Artwork, FutureButton, Spinner } from 'components';
import React, { useEffect, useState } from 'react';

import styles from './SubdomainTableRow.module.css';

import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';
import { useBidProvider } from 'lib/providers/BidProvider';
import { Bid } from 'lib/types';
import { useHistory } from 'react-router-dom';

import { NFTCard } from 'components';

type BidData = {
	highestBid: number;
	numBids: number;
};

const SubdomainTableCard = (props: any) => {
	const walletContext = useWeb3React<Web3Provider>();
	const { account } = walletContext;
	const { push: goTo } = useHistory();

	const { getBidsForDomain } = useBidProvider();

	const domain = props.data;

	const [bids, setBids] = useState<Bid[] | undefined>();

	const isOwnedByUser =
		account?.toLowerCase() === domain?.owner?.id.toLowerCase();

	useEffect(() => {
		let isMounted = true;
		const get = async () => {
			const b = await getBidsForDomain(domain);
			if (isMounted) {
				setBids(b);
			}
		};
		get();
		return () => {
			isMounted = false;
		};
	}, []);

	const onClick = () => {
		goTo(domain.name.split('wilder.')[1]);
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
			<div>
				<FutureButton
					glow={account !== undefined && !isOwnedByUser}
					onClick={() => console.log('make a bid')}
				>
					Make A Bid
				</FutureButton>
			</div>
		</NFTCard>
	);
};

export default React.memo(SubdomainTableCard);
