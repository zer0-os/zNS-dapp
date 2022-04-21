//- React Imports
import { ReactChild, ReactChildren } from 'react';

interface SvgProps {
	children: ReactChild | ReactChildren;
	className?: string;
	dataTestId?: string;
	height: string;
	title?: string;
	stroke?: string;
	width: string;
	viewBox: string;
	fill: string;
}

export const Svg = ({
	children,
	className,
	dataTestId,
	height,
	title,
	width,
	viewBox,
	fill,
	stroke,
}: SvgProps) => (
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
