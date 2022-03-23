import React, { useMemo } from 'react';

import styles from './Confirmation.module.scss';
import classNames from 'classnames/bind';

import Buttons, { ButtonsProps } from './Buttons';

interface ConfirmationProps extends ButtonsProps {
	error?: string;
	message: React.ReactNode | string;
}

const Confirmation = ({
	className,
	message,
	error,
	...rest
}: ConfirmationProps) => {
	const isMessageString = useMemo(() => {
		return ['string', 'number'].includes(typeof message);
	}, [message]);

	return (
		<div className={classNames(styles.Container, className)}>
			{isMessageString ? <p>{message}</p> : message}
			{error !== undefined && <p className="error-text text-center">{error}</p>}
			<Buttons {...rest} />
		</div>
	);
};

export default Confirmation;
