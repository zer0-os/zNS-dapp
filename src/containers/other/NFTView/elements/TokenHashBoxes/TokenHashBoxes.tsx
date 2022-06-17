//- React Imports
import React, { useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

//- Web3 Imports
import { BigNumber } from 'ethers';

//- Component Imports
import {
	ArrowLink,
	QuestionButton,
	TextButton,
	Tooltip,
	Spinner,
} from 'components';

//- Constant Imports
import { BOX_CONTENT, LINK_TEXT } from './TokenHashBoxes.constants';

//  Utils Imports
import { getStatusText, getTooltipText } from './TokenHashBoxes.utils';

//- Library Imports
import { getHashFromIPFSUrl, getWebIPFSUrlFromHash } from 'lib/ipfs';
import { chainIdToNetworkType, getEtherscanUri } from 'lib/network';
import useNotification from 'lib/hooks/useNotification';
import { truncateWalletAddress, zNAFromPathname } from 'lib/utils';
import classNames from 'classnames/bind';

//- Type Imports
import { Maybe, DisplayParentDomain } from 'lib/types';

//- Helper Imports
import { copyToClipboard } from '../../NFTView.helpers';

//- Assets
import { Copy } from 'react-feather';

//- Style Imports
import styles from '../../NFTView.module.scss';

type TokenHashBoxesProps = {
	domainId: string;
	chainId?: number;
	znsDomain: Maybe<DisplayParentDomain>;
	isTokenClaimable: boolean;
	isCheckDataLoading: boolean;
	onClaim: () => void;
};

const cx = classNames.bind(styles);

export const TokenHashBoxes: React.FC<TokenHashBoxesProps> = ({
	domainId,
	chainId,
	znsDomain,
	isTokenClaimable,
	isCheckDataLoading,
	onClaim,
}) => {
	const { pathname } = useLocation();
	const { addNotification } = useNotification();
	const statusText = getStatusText(isTokenClaimable);
	const tooltipText = getTooltipText(isTokenClaimable);
	const zna = zNAFromPathname(pathname);
	// REPLACE URL WITH LABELS.WILDER_WHEELS_ZNA
	const isWheelPath = zna.includes('candy.wolfsale');
	const ipfsHash = useMemo(() => {
		if (znsDomain) {
			return getHashFromIPFSUrl(znsDomain.metadata);
		}

		return '';
	}, [znsDomain]);

	const etherscanLink = useMemo(() => {
		const domainIdInteger = BigNumber.from(domainId);
		const networkType = chainIdToNetworkType(chainId);
		const etherscanBaseUri = getEtherscanUri(networkType);
		const registrarAddress = znsDomain ? znsDomain.contract : '';

		return `${etherscanBaseUri}token/${registrarAddress}?a=${domainIdInteger.toString()}`;
	}, [znsDomain, domainId, chainId]);

	const onCopyToClipboard = useCallback(
		(content: string, label: string) => () => {
			copyToClipboard(content);
			addNotification(`Copied ${label} to clipboard.`);
		},
		[addNotification],
	);

	return (
		<div className={styles.TokenHashContainer}>
			{isWheelPath && (
				<div className={cx(styles.Box, styles.Contract)}>
					{isCheckDataLoading ? (
						<div className={styles.Spinner}>
							<Spinner />
						</div>
					) : (
						<>
							<div className={styles.FlexWrapper}>
								<h4>{BOX_CONTENT.CLAIM_STATUS}</h4>
								<Tooltip deepPadding text={tooltipText}>
									<QuestionButton small />
								</Tooltip>
							</div>
							<p>{statusText}</p>
							{isTokenClaimable && (
								<TextButton className={styles.TextButton} onClick={onClaim}>
									{LINK_TEXT[BOX_CONTENT.CLAIM_STATUS]}
								</TextButton>
							)}
						</>
					)}
				</div>
			)}
			<div className={cx(styles.Box, styles.Contract)}>
				<h4>{BOX_CONTENT.TOKEN_ID}</h4>
				<p>
					<Copy
						className={styles.Copy}
						onClick={onCopyToClipboard(domainId, BOX_CONTENT.TOKEN_ID)}
					/>
					{truncateWalletAddress(domainId)}
				</p>
				<ArrowLink
					className={styles.BoxArrowLink}
					href={etherscanLink}
					isLinkToExternalUrl
				>
					{LINK_TEXT[BOX_CONTENT.TOKEN_ID]}
				</ArrowLink>
			</div>
			<div className={cx(styles.Box, styles.Contract)}>
				<h4>{BOX_CONTENT.IPFS_HASH}</h4>
				<p>
					<Copy
						className={styles.Copy}
						onClick={onCopyToClipboard(ipfsHash, BOX_CONTENT.IPFS_HASH)}
					/>
					{truncateWalletAddress(ipfsHash)}
				</p>
				<ArrowLink
					className={styles.BoxArrowLink}
					href={getWebIPFSUrlFromHash(ipfsHash)}
					isLinkToExternalUrl
				>
					{LINK_TEXT[BOX_CONTENT.IPFS_HASH]}
				</ArrowLink>
			</div>
		</div>
	);
};

export default TokenHashBoxes;
