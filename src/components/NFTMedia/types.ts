interface SharedProps {
	className?: string;
	style?: React.CSSProperties;
	alt: string;
	size?: string | undefined;
	onLoad?: () => void;
	onClick?: () => void;
	isPlaying?: boolean;
	disableLightbox?: boolean;
}

export interface CloudinaryMediaProps extends SharedProps {
	hash: string;
	isVideo?: boolean;
}

export interface MediaContainerProps extends SharedProps {
	ipfsUrl: string;
	isVideo?: boolean;
}
