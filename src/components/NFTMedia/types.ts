interface SharedProps {
	alt: string;
	className?: string;
	disableLightbox?: boolean;
	isPlaying?: boolean;
	onClick?: () => void;
	onError?: () => void;
	onLoad?: () => void;
	size?: string | undefined;
	style?: React.CSSProperties;
	fit?: 'contain' | 'cover';
}

export interface CloudinaryMediaProps extends SharedProps {
	hash: string;
	isVideo?: boolean;
}

export interface MediaContainerProps extends SharedProps {
	ipfsUrl: string;
	rawUrl?: string;
	isVideo?: boolean;
}
