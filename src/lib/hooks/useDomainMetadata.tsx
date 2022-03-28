import React from 'react';

import { Maybe, Metadata } from 'lib/types';
import { useZnsSdk } from 'lib/hooks/sdk';
import useAsyncEffect from 'use-async-effect';

export function useDomainMetadata(metadataUri: Maybe<string>) {
	const [metadata, setMetadata] = React.useState<Maybe<Metadata>>(undefined);
	const { instance: sdk } = useZnsSdk();

	useAsyncEffect(async () => {
		let isSubscribed = true;
		setMetadata(undefined);

		if (!metadataUri) {
			return;
		}
		const metadata = await sdk.utility.getMetadataFromUri(metadataUri);
		if (isSubscribed) {
			setMetadata({ ...metadata, ...{ title: metadata.name } });
		}

		return () => {
			isSubscribed = false;
		};
	}, [metadataUri, sdk.utility]);

	return metadata;
}
