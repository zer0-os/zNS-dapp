/**
 * Stateful container for PreviewCard.tsx
 */

// React Imports
import { useEffect, useRef, useState } from 'react';

// Library Imports
import { Maybe, Metadata } from 'lib/types';
import { getMetadata } from 'lib/metadata';
import { useHistory } from 'react-router-dom';
import useNotification from 'lib/hooks/useNotification';

// Copmonent Imports
import PreviewCard from './PreviewCard';
import { Overlay, Image } from 'components';

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
	const [isPreviewOpen, setIsPreviewOpen] = useState(false);

	const onViewDomain = () => {
		history.push({
			pathname: domain,
			search: '?view',
		});
	};

	const openImagePreview = () => setIsPreviewOpen(true);
	const closeImagePreview = () => setIsPreviewOpen(false);

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

	const modals = () => (
		<Overlay centered img open={isPreviewOpen} onClose={closeImagePreview}>
			<Image
				src={metadata?.image ?? ''}
				style={{
					width: 'auto',
					maxHeight: '80vh',
					maxWidth: '80vw',
					objectFit: 'contain',
					textAlign: 'center',
				}}
			/>
		</Overlay>
	);

	return (
		<>
			{modals()}
			<PreviewCard
				creatorId={creatorId}
				description={metadata?.description || ''}
				disabled={disabled}
				domain={domain}
				image={metadata?.image || ''}
				isLoading={!metadata}
				mvpVersion={mvpVersion}
				name={metadata?.title || ''}
				onClickImage={openImagePreview}
				onImageClick={onImageClick}
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
