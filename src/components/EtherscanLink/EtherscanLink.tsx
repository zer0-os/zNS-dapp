import React, { useMemo } from 'react';

// - Library
import { truncateWalletAddress } from 'lib/utils';

// - Constants
import { URLS } from 'constants/urls';

// Styles
import classNames from 'classnames/bind';
import styles from './EtherscanLink.module.scss';

// - Types
import type { EtherscanLinkProps } from './EtherscanLink.types';

export const EtherscanLink: React.FC<EtherscanLinkProps> = ({
	address = '',
	shouldTruncated = true,
	truncatingStartCharactersCount = 4,
	className = '',
}) => {
	const linkPresentation = useMemo(() => {
		if (!address || !shouldTruncated) return address;

		return truncateWalletAddress(address, truncatingStartCharactersCount);
	}, [shouldTruncated, address, truncatingStartCharactersCount]);

	if (!linkPresentation) return null;

	return (
		<a
			className={classNames(styles.Link, className)}
			href={URLS.ETHERSCAN + address}
			target="_blank"
			rel="noreferrer"
		>
			{linkPresentation}
		</a>
	);
};
