import { useState } from 'react';
import { Maybe, Metadata } from 'lib/types';
import { getMetadata } from 'lib/metadata';
import { useZnsSdk } from 'lib/hooks/sdk';
import useAsyncEffect from 'use-async-effect';

export function useDomainMetadata(metadataUri: Maybe<string>) {
	const [metadata, setMetadata] = useState<Maybe<Metadata>>(undefined);
	const { instance: sdk } = useZnsSdk();

	useAsyncEffect(async () => {
		let isSubscribed = true;
		setMetadata(undefined);

		if (!metadataUri) {
			return;
		}
		const m: Metadata | undefined = await getMetadata(metadataUri);
		if (isSubscribed) {
			setMetadata(m);
		}

		return () => {
			isSubscribed = false;
		};
	}, [metadataUri, sdk.utility]);

	return metadata;
}
