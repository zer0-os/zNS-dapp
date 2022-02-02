/* eslint-disable react-hooks/exhaustive-deps */
// React Imports
import { useEffect, useRef, useState } from 'react';

// Library Imports
import { getMetadata } from 'lib/metadata';

// Type Imports
import { Metadata } from 'lib/types';

// Local Imports
import NFTCard from './NFTCard';
import { NFTCardProps } from './NFTCard';

interface NFTCardContainerProps extends NFTCardProps {
	metadataUrl?: string;
}

const NFTCardContainer: React.FC<NFTCardContainerProps> = (props) => {
	const isMounted = useRef<boolean>();
	const [metadata, setMetadata] = useState<Metadata | undefined>();

	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

	// Grabs metadata from URL if URL is provided
	useEffect(() => {
		if (props.metadataUrl) {
			if (isMounted.current === false) return;
			setMetadata(undefined);
			getMetadata(props.metadataUrl).then((m) => {
				if (isMounted.current === false) return;
				setMetadata(m);
				getProps();
			});
		}
	}, [props.metadataUrl]);

	// Creates a prop object to pass through to child
	const getProps = (): NFTCardProps => {
		return {
			...props,
			name: metadata?.title || '',
			imageUri: metadata?.image_full || metadata?.image || '',
		};
	};

	return <NFTCard {...getProps()} />;
};

export default NFTCardContainer;
