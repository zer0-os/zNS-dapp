import { useEffect, useState } from 'react';

import { Maybe, Metadata } from 'lib/types';
import { getMetadata } from 'lib/metadata';

import PreviewCard from './PreviewCard';

type PreviewCardContainerProps = {
	children?: React.ReactNode;
	creatorId: string;
	disabled: Maybe<boolean>;
	domain: string;
	mvpVersion: number;
	onButtonClick: () => void;
	onImageClick?: () => void;
	ownerId: string;
	style?: React.CSSProperties;
	metadataUrl?: string;
};

const PreviewCardContainer: React.FC<PreviewCardContainerProps> = ({
	children,
	creatorId,
	disabled,
	domain,
	mvpVersion,
	onButtonClick,
	onImageClick,
	ownerId,
	style,
	metadataUrl,
}) => {
	// Grab metadata and pass it to previewcard
	const [metadata, setMetadata] = useState<Metadata | undefined>();

	useEffect(() => {
		setMetadata(undefined);
		if (!metadataUrl) return;
		getMetadata(metadataUrl).then((m) => {
			if (!m) return;
			else setMetadata(m);
		});
	}, [metadataUrl]);

	return (
		<PreviewCard
			image={metadata?.image || ''}
			name={metadata?.title || ''}
			domain={domain}
			description={metadata?.description || ''}
			creatorId={creatorId}
			disabled={disabled}
			ownerId={ownerId}
			isLoading={!metadata}
			mvpVersion={mvpVersion}
			onButtonClick={onButtonClick}
			onImageClick={onImageClick}
			style={style}
		>
			{children}
		</PreviewCard>
	);
};

export default PreviewCardContainer;
