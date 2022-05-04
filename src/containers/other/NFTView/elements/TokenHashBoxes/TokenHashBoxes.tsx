//- React Imports
import React, { useMemo, useCallback } from 'react';

//- Web3 Imports
import { BigNumber } from 'ethers';

//- Component Imports
import { ArrowLink } from 'components';

//- Library Imports
import { getHashFromIPFSUrl, getWebIPFSUrlFromHash } from 'lib/ipfs';
import { chainIdToNetworkType, getEtherscanUri } from 'lib/network';
import useNotification from 'lib/hooks/useNotification';
import { truncateWalletAddress } from 'lib/utils';

//- Type Imports
import { Maybe, DisplayParentDomain } from 'lib/types';

//- Helper Imports
import { copyToClipboard } from '../../NFTView.helpers';

//- Asset Imports
import copyIcon from '../../assets/copy-icon.svg';

//- Style Imports
import styles from '../../NFTView.module.scss';

//- Componennt level type definitions
type TokenHashBoxesProps = {
	domainId: string;
	chainId?: number;
	znsDomain: Maybe<DisplayParentDomain>;
};

export const TokenHashBoxes: React.FC<TokenHashBoxesProps> = ({
	domainId,
	chainId,
	znsDomain,
}) => {
	const { addNotification } = useNotification();

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
		<div className={`${styles.TokenHashContainer}`}>
			<div className={`${styles.Box} ${styles.Contract} border-rounded`}>
				<h4>Token Id</h4>
				<p>
					<img
						onClick={onCopyToClipboard(domainId, 'Token ID')}
						className={styles.Copy}
						src={copyIcon}
						alt="Copy Contract Icon"
					/>
					{truncateWalletAddress(domainId)}
				</p>
				<ArrowLink
					style={{
						marginTop: 8,
						width: 150,
					}}
					href={etherscanLink}
					isLinkToExternalUrl
				>
					View on Etherscan
				</ArrowLink>
			</div>
			<div className={`${styles.Box} ${styles.Contract} border-rounded`}>
				<h4>IPFS Hash</h4>
				<p>
					<img
						onClick={onCopyToClipboard(ipfsHash, 'IPFS Hash')}
						className={styles.Copy}
						src={copyIcon}
						alt="Copy IPFS Hash Icon"
					/>
					{truncateWalletAddress(ipfsHash)}
				</p>
				<ArrowLink
					style={{
						marginTop: 8,
						width: 105,
					}}
					href={getWebIPFSUrlFromHash(ipfsHash)}
					isLinkToExternalUrl
				>
					View on IPFS
				</ArrowLink>
			</div>
		</div>
	);
};

export default TokenHashBoxes;
