import React from 'react';
import classNames from 'classnames/bind';
import styles from './Chiclet.module.scss';

export const TEST_ID = {
	CHICLET: 'chiclet',
};

export type ChicletType = 'normal' | 'warning' | 'error';

type ChicletProps = {
	type?: ChicletType;
	className?: string;
	onClick?: (event?: any) => any | void;
	style?: React.CSSProperties;
};

const cx = classNames.bind(styles);

const Chiclet: React.FC<ChicletProps> = ({
	children,
	type = 'normal',
	className,
	onClick,
	style,
}) => {
	const handleClick = () => {
		if (onClick) onClick();
	};

	return (
		<span
			onClick={handleClick}
			className={cx(className, styles.Chiclet, {
				Warning: type === 'warning',
				Error: type === 'error',
			})}
			style={style}
			data-testid={TEST_ID.CHICLET}
		>
			{children}
		</span>
	);
};

export default Chiclet;
