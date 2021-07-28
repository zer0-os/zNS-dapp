import React from 'react';

import { Maybe, Metadata } from 'lib/types';
import { getMetadata } from 'lib/metadata';

export function useDomainMetadata(metadataUri: Maybe<string>) {
  const [metadata, setMetadata] = React.useState<Maybe<Metadata>>(null);

  React.useEffect(() => {
    let isSubscribed = true;

    if (!metadataUri) {
      return;
    }

    setMetadata(null);

    const fetchMetadata = async () => {
      const metadata = await getMetadata(metadataUri);

      if (isSubscribed) {
        setMetadata(metadata);
      }
    }

    fetchMetadata();

    return () => {
      isSubscribed = false;
    }

  }, [metadataUri]);

  return metadata;
}