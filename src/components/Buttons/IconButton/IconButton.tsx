import React, { useState } from 'react';

import styles from './IconButton.module.scss';

type IconButtonProps = {
	className?: string;
	toggleable?: boolean;
	iconUri: string;
	style?: React.CSSProperties;
	toggled?: boolean;
	onClick: () => void;
	alt?: string;
	disabled?: boolean;
};

export const TEST_ID = {
	CONTAINER: 'icon-button-container',
	CONTENT: 'icon-button-image',
};

const IconButton: React.FC<IconButtonProps> = ({
	className,
	toggleable,
	toggled,
	iconUri,
	style,
	onClick,
	alt,
	disabled,
}) => {
	const [selected, setSelected] = useState(false);

	const altText = alt || 'clickable icon';

	const handleClick = () => {
		if (disabled) return;
		setSelected(!selected);
		if (onClick) onClick();
	};

	return (
		<button
			style={style}
			onClick={handleClick}
			className={`${styles.iconButton} ${
				(toggleable && selected) || toggled ? styles.selected : ''
			} ${disabled ? styles.Disabled : ''} ${className ? className : ''}`}
			data-testid={TEST_ID.CONTAINER}
		>
			<img alt={altText} src={iconUri} data-testid={TEST_ID.CONTENT} />
		</button>
	);
};

export default IconButton;
