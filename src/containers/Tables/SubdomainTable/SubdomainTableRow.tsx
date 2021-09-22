import { Artwork, FutureButton, Spinner } from 'components';
import React, { useEffect, useState } from 'react';

import styles from './SubdomainTableRow.module.css';

import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';
import { useBidProvider } from 'lib/providers/BidProvider';
import { Bid } from 'lib/types';
import { useHistory } from 'react-router-dom';
import { useBid } from './BidProvider';

type BidData = {
	highestBid: number;
	numBids: number;
};

const SubdomainTableRow = (props: any) => {
	const walletContext = useWeb3React<Web3Provider>();
	const { account } = walletContext;
	const { push: goTo } = useHistory();

	const { makeABid } = useBid();
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

	const bidColumns = () => {
		if (bids) {
			return (
				<>
					<td className={styles.Right}>
						{bids[0] ? bids[0].amount.toLocaleString() + ' WILD' : '-'}
					</td>
					<td className={styles.Right}>{bids.length.toLocaleString()}</td>
				</>
			);
		} else {
			return (
				<>
					<td className={styles.Right}>
						<Spinner />
					</td>
					<td className={styles.Right}>
						<Spinner />
					</td>
				</>
			);
		}
	};

	const onBidButtonClick = () => {
		makeABid(domain);
	};

	const onRowClick = (event: any) => {
		const clickedButton = event.target.className.indexOf('FutureButton') >= 0;
		if (!clickedButton) {
			goTo(domain.name.split('wilder.')[1]);
		}
	};

	return (
		<tr className={styles.Row} onClick={onRowClick}>
			<td>{props.rowNumber + 1}</td>
			<td>
				<Artwork
					domain={domain.name.split('wilder.')[1]}
					disableInteraction
					metadataUrl={domain.metadata}
					id={domain.id}
					style={{ maxWidth: 200 }}
				/>
			</td>
			{bidColumns()}
			<td>
				<FutureButton
					glow={account !== undefined && !isOwnedByUser}
					onClick={onBidButtonClick}
					style={{ marginLeft: 'auto' }}
				>
					Make A Bid
				</FutureButton>
			</td>
		</tr>
	);
};

export default React.memo(SubdomainTableRow);
