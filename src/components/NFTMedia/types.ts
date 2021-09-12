interface SharedProps {
	alt: string;
	className?: string;
	disableLightbox?: boolean;
	isPlaying?: boolean;
	onClick?: () => void;
	onLoad?: () => void;
	size?: string | undefined;
	style?: React.CSSProperties;
}

export interface CloudinaryMediaProps extends SharedProps {
	hash: string;
	isVideo?: boolean;
}

export interface MediaContainerProps extends SharedProps {
	ipfsUrl: string;
	isVideo?: boolean;
}
