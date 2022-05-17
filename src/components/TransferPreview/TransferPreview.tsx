//- React Imports
import React from 'react';
import { Link } from 'react-router-dom';

//- Component Imports
import { Image } from 'components';

//- Hook Imports
import { useTransfer } from 'lib/hooks/useTransfer';

//- Constant Imports
import { URLS } from 'constants/urls';
import { ALT_TEXT, MESSAGES, TITLE } from './TransferPreview.constants';
import { ROOT_DOMAIN } from 'constants/domains';

//- Library Imports
import { Maybe } from 'lib/types';
import { truncateDomain, truncateWalletAddress } from 'lib/utils';
import { randomUUID } from 'lib/random';

//- Utils Imports
import {
	getPreviewPrompt,
	getPreviewSubtitle,
	MAX_CHARACTER_VALUE,
} from './TansferPreview.utils';

//- Style Imports
import styles from './TranferPreview.module.scss';

//- Assets Imports
import questionMark from './assets/question-mark-icon.svg';

const TransferPreview = () => {
	///////////
	// Hooks //
	///////////
	const { transferring, transferred } = useTransfer();

	///////////////
	// Fragments //
	///////////////
	const previewCard = (nft: any, exists: boolean) => {
		return (
			<>
				<li key={`${nft.name}${randomUUID()}`}>
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
								0://
								{truncateDomain(
									(ROOT_DOMAIN.length ? ROOT_DOMAIN + '.' : '') +
										nft.domainName,
									MAX_CHARACTER_VALUE,
								)}
							</Link>

							<p>{getPreviewSubtitle(exists)}</p>
							<a
								href={URLS.ETHERSCAN + nft.walletAddress}
								className={styles.Address}
								target="_blank"
								rel="noreferrer"
							>
								{truncateWalletAddress(nft.walletAddress, 2)}
							</a>

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
									<div>{!exists && MESSAGES.TRANSFER_TIME}</div>
								</div>
							</div>
						</div>
					</div>
				</li>
			</>
		);
	};

	const transferringPreview = (nft: any, exists: boolean) => {
		return previewCard(nft, exists);
	};

	let transferringSection: Maybe<React.ReactFragment>;
	if (transferring.length > 0 || transferred.length > 0) {
		transferringSection = (
			<>
				{transferring.map((n: any) => transferringPreview(n, false))}
				{transferred.map((n: any) => transferringPreview(n, true))}
			</>
		);
	}

	return (
		<div
			className={`${styles.TransferPreview} border-primary border-rounded background-primary`}
		>
			<h4>{TITLE.TRANSFER_OWNERSHIP}</h4>
			<ul>{transferringSection}</ul>
		</div>
	);
};

export default TransferPreview;
