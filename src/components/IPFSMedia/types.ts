interface SharedProps {
	className?: string;
	style?: React.CSSProperties;
}

interface MediaProps extends SharedProps {
	mediaExtension?: string;
}

interface MediaContainerProps extends SharedProps {}
