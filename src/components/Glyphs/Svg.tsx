interface SvgProps {
	className?: string;
	dataTestId?: string;
	height: string;
	title?: string;
	stroke?: string;
	width: string;
	viewBox: string;
	fill: string;
}

export const Svg: React.FC<SvgProps> = ({
	children,
	className,
	dataTestId,
	height,
	title,
	width,
	viewBox,
	fill,
	stroke,
}) => (
	<svg
		className={className}
		data-testid={dataTestId}
		height={height}
		width={width}
		viewBox={viewBox}
		fill={fill}
		stroke={stroke}
	>
		{title && <title>{title}</title>}
		{children}
	</svg>
);
