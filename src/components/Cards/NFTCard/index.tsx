// React Imports
import { useEffect, useState } from 'react';

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
	const [metadata, setMetadata] = useState<Metadata | undefined>();

	// Grabs metadata from URL if URL is provided
	useEffect(() => {
		if (props.metadataUrl && !metadata) {
			getMetadata(props.metadataUrl).then((m) => {
				setMetadata(m);
				getProps();
			});
		}
	}, []);

	// Creates a prop object to pass through to child
	const getProps = (): NFTCardProps => {
		return {
			...props,
			name: metadata?.title || '',
			imageUri: metadata?.image || '',
		};
	};

	return <NFTCard {...getProps()} />;
};

export default NFTCardContainer;
