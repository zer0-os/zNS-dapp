/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Stateful container for PreviewCard.tsx
 */

// React Imports
import { useEffect, useRef, useState } from 'react';

// Library Imports
import { Maybe, Metadata } from 'lib/types';
import { getMetadata } from 'lib/metadata';
import { useHistory } from 'react-router-dom';

// Copmonent Imports
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
	preventInteraction?: boolean;
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
	preventInteraction,
	metadataUrl,
}) => {
	const history = useHistory();
	const isMounted = useRef<boolean>();

	const [metadata, setMetadata] = useState<Metadata | undefined>();

	const onViewDomain = () => {
		const params = new URLSearchParams(window.location.search);
		params.set('view', 'true');
		history.push({
			pathname: domain,
			search: params.toString(),
		});
	};

	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

	useEffect(() => {
		setMetadata(undefined);
		if (domain === '/' || !metadataUrl) return;
		getMetadata(metadataUrl).then((m) => {
			if (isMounted.current === false || !m) return;
			else setMetadata(m);
		});
	}, [metadataUrl]);

	/////////////////////
	// React Fragments //
	/////////////////////

	return (
		<>
			<PreviewCard
				creatorId={creatorId}
				description={metadata?.description || ''}
				disabled={disabled}
				domain={domain}
				image={
					(metadata?.animation_url ||
						metadata?.image_full ||
						metadata?.image ||
						'') as string
				}
				isLoading={!metadata || domain.length === 0}
				mvpVersion={mvpVersion}
				name={metadata?.name || ''}
				onMakeBid={onButtonClick}
				onViewDomain={onViewDomain}
				ownerId={ownerId}
				preventInteraction={preventInteraction}
				style={style}
			>
				{children}
			</PreviewCard>
		</>
	);
};

export default PreviewCardContainer;
