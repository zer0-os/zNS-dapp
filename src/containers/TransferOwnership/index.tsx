import { getMetadata } from 'lib/metadata';
import { Metadata } from 'lib/types';
import { useEffect, useState } from 'react';

import TransferOwnership from './TransferOwnership';

type TransferOwnershipContainerProps = {
	metadataUrl: string;
	domainName: string;
	domainId: string;
	creatorId: string;
	ownerId: string;
	onModalChange: (arg: boolean) => void;
};

const TransferOwnershipContainer: React.FC<TransferOwnershipContainerProps> = ({
	metadataUrl,
	domainName,
	domainId,
	creatorId,
	ownerId,
	onModalChange,
}) => {
	const [metadata, setMetadata] = useState<Metadata | undefined>();

	useEffect(() => {
		setMetadata(undefined);
		if (metadataUrl) {
			getMetadata(metadataUrl).then((m) => {
				if (!m) return;
				else setMetadata(m);
			});
		}
	}, [metadataUrl]);

	return (
		<TransferOwnership
			name={metadata?.title || ''}
			image={metadata?.image || ''}
			domainName={domainName}
			domainId={domainId}
			onModalChange={onModalChange}
			creatorId={creatorId}
			ownerId={ownerId}
		/>
	);
};

export default TransferOwnershipContainer;
