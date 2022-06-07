//- React Imports
import React from 'react';
import { Link } from 'react-router-dom';

//- Library Imports
import { Maybe, NftStatusCard } from 'lib/types';
import { getNetworkZNA, truncateDomain, zNAToLink } from 'lib/utils';
import { useStaking } from 'lib/hooks/useStaking';
import { chainIdToNetworkType, getEtherscanUri } from 'lib/network';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

//- Component Imports
import { Image } from 'components';

//- Hook Imports
import useMint from 'lib/hooks/useMint';

//- Utils Imports
import { getPreviewPrompt, MAX_CHARACTER_VALUE } from './MintPreview.utils';

//- Style Imports
import styles from './MintPreview.module.scss';

//- Constants Imports
import {
	TITLE,
	ALT_TEXT,
	MESSAGES,
	BUTTON_TEXT,
} from './MintPreview.constants';

//- Assets Imports
import questionMark from './assets/question-mark-icon.svg';

type MintPreviewProps = {
	onOpenProfile: () => void;
};

const MintPreview = (props: MintPreviewProps) => {
	const walletContext = useWeb3React<Web3Provider>();
	const { chainId } = walletContext;

	const networkType = chainIdToNetworkType(chainId);
	const baseEtherscanUri = getEtherscanUri(networkType);

	const { minting, minted } = useMint();
	const { requesting, requested } = useStaking();

	const statusCard = (
		nft: NftStatusCard,
		exists: boolean,
		isCompleted: boolean,
		statusText?: string,
	) => {
		const link = zNAToLink(nft.zNA);
		const parsedLink = getNetworkZNA(link);
		const etherscanLink = `${baseEtherscanUri}tx/${nft.transactionHash}`;

		const statusStyle = {
			color: isCompleted ? 'var(--color-success)' : 'var(--color-grey)',
			fontWeight: 700,
		};

		return (
			<>
				<li key={`${nft.title}${Math.random()}`}>
					<hr className={styles.Divider} />
					<div>
						<div className={`${styles.Image} border-rounded`}>
							{/* @todo fix hardcoded handling of name */}
							<Link to={parsedLink}>
								{nft.imageUri.indexOf('cloudinary') > -1 ? (
									<img
										alt={ALT_TEXT.NFT_PREVIEW}
										style={{ objectFit: 'cover' }}
										src={nft.imageUri}
									/>
								) : (
									<Image src={nft.imageUri} />
								)}
							</Link>
						</div>
						<div className={styles.Info}>
							<h3>{nft.title}</h3>
							<Link className={styles.Link} to={parsedLink}>
								{truncateDomain(nft.zNA, MAX_CHARACTER_VALUE)}
							</Link>

							<p>{nft.story}</p>

							<div className={styles.Container}>
								{!exists && (
									<div className={styles.IconContainer}>
										<img alt={ALT_TEXT.QUESTION_MARK} src={questionMark} />
									</div>
								)}
								<div
									className={`${styles.TextContainer} ${
										exists ? styles.Success : ''
									}`}
								>
									<div>{getPreviewPrompt(exists)}</div>
									<div>{!exists && MESSAGES.MINTING_TIME}</div>
									<div className={styles.ButtonContainer}>
										{nft.transactionHash.length > 0 && (
											<a
												target={'_blank'}
												href={etherscanLink}
												rel="noreferrer"
											>
												{BUTTON_TEXT.ETHERSCAN}
											</a>
										)}
									</div>
								</div>
							</div>

							<div>
								{nft.stakeAmount && nft.stakeAmount.length > 0 ? (
									<p style={{ marginTop: '16px' }}>
										Stake Amount: {nft.stakeAmount} LOOT
									</p>
								) : null}
								<div style={statusStyle}>{statusText}</div>
							</div>
						</div>
					</div>
				</li>
			</>
		);
	};

	const mintingStatusCard = (nft: NftStatusCard, exists: boolean) => {
		return statusCard(nft, exists, exists);
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
				<h4>{TITLE.MINT_NFT}</h4>
				{minting.map((n: NftStatusCard) => mintingStatusCard(n, false))}
				{minted.map((n: NftStatusCard) => mintingStatusCard(n, true))}
			</>
		);
	}

	let requestSection: Maybe<React.ReactFragment>;
	if (requesting.length > 0 || requested.length > 0) {
		requestSection = (
			<>
				<h4 className="glow-text-white">Requests</h4>
				{requesting.map((n: NftStatusCard) => requestingStatusCard(n, false))}
				{requested.map((n: NftStatusCard) => requestingStatusCard(n, true))}
			</>
		);
	}

	return (
		<ul
			className={`${styles.MintPreview} border-primary border-rounded background-primary`}
		>
			{mintingSection}
			{requestSection}
		</ul>
	);
};

export default MintPreview;
