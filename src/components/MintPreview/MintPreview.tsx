//- React Imports
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

//- Component Imports
import { Image } from 'components';

//- Hook Imports
import { useMintProvider } from 'lib/providers/MintProvider';

//- Style Imports
import styles from './MintPreview.module.css';
import { Maybe, NftStatusCard } from 'lib/types';
import { zNAToLink } from 'lib/utils';
import { useStakingProvider } from 'lib/providers/StakingRequestProvider';
import { chainIdToNetworkType, getEtherscanUri } from 'lib/network';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

const MintPreview = () => {
	const walletContext = useWeb3React<Web3Provider>();
	const { chainId } = walletContext;

	const networkType = chainIdToNetworkType(chainId);
	const baseEtherscanUri = getEtherscanUri(networkType);

	const mintProvider = useMintProvider();
	const stakingProvider = useStakingProvider();

	const statusCard = (
		nft: NftStatusCard,
		exists: boolean,
		isCompleted: boolean,
		statusText: string,
	) => {
		const link = zNAToLink(nft.zNA);
		const etherscanLink = `${baseEtherscanUri}tx/${nft.transactionHash}`;

		const statusStyle = {
			color: isCompleted ? 'var(--color-success)' : 'var(--color-grey)',
			fontWeight: 700,
		};

		return (
			<>
				<hr className="glow" />
				<li key={`${nft.title}${Math.random()}`}>
					<div className={`${styles.Image} border-rounded`}>
						{exists ? (
							<Link to={link}>
								<Image src={nft.imageUri} />
							</Link>
						) : (
							<Image src={nft.imageUri} />
						)}
					</div>
					<div className={styles.Info}>
						<h5 className="glow-text-blue">{nft.title}</h5>

						{exists ? (
							<Link to={link}>{nft.zNA}</Link>
						) : (
							<span style={{ color: 'var(--color-grey)', fontWeight: 700 }}>
								{nft.zNA}
							</span>
						)}

						<p>{nft.story}</p>
						{nft.stakeAmount && nft.stakeAmount.length > 0 ? (
							<p style={{ marginTop: '16px' }}>
								Stake Amount: {nft.stakeAmount} LOOT
							</p>
						) : null}
						<p>
							<div style={statusStyle}>{statusText}</div>
							<a target={'_blank'} href={etherscanLink}>
								View on Etherscan
							</a>
						</p>
					</div>
				</li>
			</>
		);
	};

	const mintingStatusCard = (nft: NftStatusCard, exists: boolean) => {
		const statusText = exists ? 'Minting completed!' : 'Minting domain...';
		return statusCard(nft, exists, exists, statusText);
	};

	const requestingStatusCard = (nft: NftStatusCard, placed: boolean) => {
		const statusText = placed
			? 'Request placed successfully!'
			: 'Placing request...';
		return statusCard(nft, false, placed, statusText);
	};

	let mintingSection: Maybe<React.ReactFragment>;
	if (mintProvider.minting.length > 0 || mintProvider.minted.length > 0) {
		mintingSection = (
			<>
				<h4 className="glow-text-white">Minting</h4>
				{mintProvider.minting.map((n: NftStatusCard) =>
					mintingStatusCard(n, false),
				)}
				{mintProvider.minted.map((n: NftStatusCard) =>
					mintingStatusCard(n, true),
				)}
			</>
		);
	}

	let requestSection: Maybe<React.ReactFragment>;
	if (
		stakingProvider.requesting.length > 0 ||
		stakingProvider.requested.length > 0
	) {
		requestSection = (
			<>
				<h4 className="glow-text-white">Requests</h4>
				{stakingProvider.requesting.map((n: NftStatusCard) =>
					requestingStatusCard(n, false),
				)}
				{stakingProvider.requested.map((n: NftStatusCard) =>
					requestingStatusCard(n, true),
				)}
			</>
		);
	}

	return (
		<ul className={`${styles.MintPreview} border-primary border-rounded blur`}>
			{mintingSection}
			{requestSection}
		</ul>
	);
};

export default MintPreview;
