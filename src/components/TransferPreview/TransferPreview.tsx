//- React Imports
import React from 'react';
import { Link } from 'react-router-dom';

//- Component Imports
import { Image } from 'components';

//- Hook Imports
import { useTransfer } from 'lib/hooks/useTransfer';

//- Constant Imports
import { URLS } from 'constants/urls';
import { ALT_TEXT, MESSAGES } from './TransferPreview.constants';

//- Utils Imports
import {
	getPreviewPrompt,
	getPreviewSubtitle,
	getPreviewTitle,
	MAX_CHARACTER_VALUE,
} from './TansferPreview.utils';
import { truncateDomain, truncateWalletAddress } from 'lib/utils';

//- Style Imports
import styles from './TranferPreview.module.scss';

//- Assets Imports
import questionMark from './assets/question-mark-icon.svg';
import { is } from '@react-spring/shared';

const TransferPreview = () => {
	//////////////////////////
	// Hooks & State & Data //
	//////////////////////////
	const { transferring, transferred } = useTransfer();
	const isTxCompleted = transferred.length > 0;
	const isTxInProgress = transferring.length > 0;
	const previewTitle = getPreviewTitle(isTxCompleted);
	const previewPrompt = getPreviewPrompt(isTxCompleted);
	const previewSubtitle = getPreviewSubtitle(isTxCompleted);

	///////////////
	// Fragments //
	///////////////
	const nft = (nft: any, minted: boolean) => (
		<li key={`${nft.name}${Math.random()}`}>
			<hr className={styles.Divider} />
			<div>
				<div className={`${styles.Image} border-rounded`}>
					<Link to={`${nft.domainName}`}>
						<Image src={nft.image} />
					</Link>
				</div>
				<div className={styles.Info}>
					<h3>{nft.name}</h3>

					<Link className={styles.Link} to={`${nft.domainName}`}>
						0://{truncateDomain(nft.domainName, MAX_CHARACTER_VALUE)}
					</Link>

					<p>{previewSubtitle}</p>
					<a
						href={URLS.ETHERSCAN + nft.walletAddress}
						className={styles.Address}
						target="_blank"
						rel="noreferrer"
					>
						{truncateWalletAddress(nft.walletAddress, 2)}
					</a>

					<div className={styles.InfoContainer}>
						<div className={styles.IconContainer}>
							<img alt={ALT_TEXT.QUESTION_MARK} src={questionMark} />
						</div>
						<div
							className={`${styles.TextContainer} ${
								isTxCompleted ? styles.Success : ''
							}`}
						>
							<div>{previewPrompt}</div>
							<div>{!isTxCompleted && MESSAGES.TRANSFER_TIME}</div>
						</div>
					</div>
				</div>
			</div>
		</li>
	);

	return (
		<div
			className={`${styles.TransferPreview} border-primary border-rounded background-primary`}
		>
			<h4>{previewTitle}</h4>
			<ul>{transferring.map((n: any) => nft(n, false))}</ul>
			<ul>{transferred.map((n: any) => nft(n, false))}</ul>
		</div>
	);
};

export default TransferPreview;
