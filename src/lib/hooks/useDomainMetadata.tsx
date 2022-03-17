import React from 'react';

import { Maybe, Metadata } from 'lib/types';
import { getMetadata } from 'lib/metadata';
import { useZnsSdk } from 'lib/providers/ZnsSdkProvider';

export function useDomainMetadata(metadataUri: Maybe<string>) {
	const [metadata, setMetadata] = React.useState<Maybe<Metadata>>(null);
	const { instance: sdk } = useZnsSdk();

	React.useEffect(() => {
		let isSubscribed = true;

		if (!metadataUri) {
			return;
		}

		setMetadata(null);

		const fetchMetadata = async () => {
			const metadata = await sdk.utility.getMetadataFromUri(metadataUri);
			if (isSubscribed) {
				setMetadata({ ...metadata, ...{ title: metadata.name } });
			}
		};

		fetchMetadata();

		return () => {
			isSubscribed = false;
		};
	}, [metadataUri]);

	return metadata;
}
