import { useState } from 'react';
import { DomainMetadata } from '@zero-tech/zns-sdk/lib/types';
import { Maybe, Metadata } from 'lib/types';
import { parseDomainMetadata } from 'lib/metadata';
import { useZnsSdk } from 'lib/hooks/sdk';
import useAsyncEffect from 'use-async-effect';

export function useDomainMetadata(metadataUri: Maybe<string>): Maybe<Metadata> {
	const [metadata, setMetadata] = useState<Maybe<Metadata>>(undefined);
	const { instance: sdk } = useZnsSdk();

	useAsyncEffect(async () => {
		let isSubscribed = true;
		setMetadata(undefined);

		if (!metadataUri) {
			return;
		}
		const domainMetadata: DomainMetadata = await sdk.utility.getMetadataFromUri(
			metadataUri,
		);
		if (isSubscribed) {
			const parsedMetadata: Metadata = parseDomainMetadata(domainMetadata);
			setMetadata(parsedMetadata);
		}

		return () => {
			isSubscribed = false;
		};
	}, [metadataUri, sdk.utility]);

	return metadata;
}
