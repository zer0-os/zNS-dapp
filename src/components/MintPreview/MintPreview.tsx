//- React Imports
import React from 'react';
import { Link } from 'react-router-dom';

//- Component Imports
import { FutureButton, Image } from 'components';

//- Hook Imports
import useMint from 'lib/hooks/useMint';

//- Style Imports
import styles from './MintPreview.module.scss';
import { Maybe, NftStatusCard } from 'lib/types';
import { zNAToLink } from 'lib/utils';
import { useStakingProvider } from 'lib/providers/StakingRequestProvider';
import { chainIdToNetworkType, getEtherscanUri } from 'lib/network';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

type MintPreviewProps = {
	onOpenProfile: () => void;
};

const MintPreview = (props: MintPreviewProps) => {
	const walletContext = useWeb3React<Web3Provider>();
	const { chainId } = walletContext;

	const networkType = chainIdToNetworkType(chainId);
	const baseEtherscanUri = getEtherscanUri(networkType);

	const { minting, minted } = useMint();
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

		const openProfile = () => {
			if (props.onOpenProfile) {
				props.onOpenProfile();
			}
		};

		return (
			<>
				<hr className="glow" />
				<li key={`${nft.title}${Math.random()}`}>
					<div className={`${styles.Image} border-rounded`}>
						{/* @todo fix hardcoded handling of name */}
						{nft.imageUri.indexOf('cloudinary') > -1 ? (
							<img
								alt="nft preview"
								style={{ objectFit: 'cover' }}
								src={nft.imageUri}
							/>
						) : (
							<Image src={nft.imageUri} />
						)}
					</div>
					<div className={styles.Info}>
						<div>
							<h5 className="glow-text-blue">{nft.title}</h5>

							{nft.zNA.length > 0 && (
								<>
									{exists ? (
										<Link to={link}>{nft.zNA}</Link>
									) : (
										<span
											style={{ color: 'var(--color-grey)', fontWeight: 700 }}
										>
											{nft.zNA}
										</span>
									)}
								</>
							)}
						</div>

						{isCompleted &&
							nft.zNA.length === 0 &&
							props.onOpenProfile !== undefined && (
								<FutureButton glow onClick={openProfile}>
									View In Profile
								</FutureButton>
							)}

						<div>
							{nft.stakeAmount && nft.stakeAmount.length > 0 ? (
								<p style={{ marginTop: '16px' }}>
									Stake Amount: {nft.stakeAmount} LOOT
								</p>
							) : null}
							<div style={statusStyle}>{statusText}</div>
							{nft.transactionHash.length > 0 && (
								<p>
									<a target={'_blank'} href={etherscanLink} rel="noreferrer">
										View on Etherscan
									</a>
								</p>
							)}
						</div>
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
	if (minting.length > 0 || minted.length > 0) {
		mintingSection = (
			<>
				<h4 className="glow-text-white">Minting</h4>
				{minting.map((n: NftStatusCard) => mintingStatusCard(n, false))}
				{minted.map((n: NftStatusCard) => mintingStatusCard(n, true))}
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
