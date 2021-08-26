interface SharedProps {
	className?: string;
	style?: React.CSSProperties;
	alt: string;
}

export interface MediaProps extends SharedProps {
	type: string;
	extension: string;
	data: string; // Temp until we work this one out
}

export interface MediaContainerProps extends SharedProps {
	url: string;
}
