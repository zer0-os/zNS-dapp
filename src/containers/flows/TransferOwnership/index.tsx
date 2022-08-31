//- React Imports
import { useEffect, useState } from 'react';

//- Component Imports
import TransferOwnership from './TransferOwnership';

//- LibraryImports

import { getMetadata } from 'lib/metadata';
import { Metadata } from 'lib/types';

type TransferOwnershipContainerProps = {
	metadataUrl: string;
	domainName: string;
	domainId: string;
	creatorId: string;
	ownerId: string;
	onTransfer: () => void;
};

const TransferOwnershipContainer: React.FC<TransferOwnershipContainerProps> = ({
	metadataUrl,
	domainName,
	domainId,
	creatorId,
	ownerId,
	onTransfer,
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
			onTransfer={onTransfer}
			creatorId={creatorId}
			ownerId={ownerId}
		/>
	);
};

export default TransferOwnershipContainer;
