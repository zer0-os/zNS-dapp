import successIcon from './assets/success.svg';
import errorIcon from './assets/error.svg';

import styles from './Message.module.scss';

import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

type MessageProps = {
	message: string;
	error?: boolean;
};

const Message = ({ message, error }: MessageProps) => (
	<div className={cx(styles.Message, 'border-rounded')}>
		<img alt="error indicator" src={error ? errorIcon : successIcon} />
		<div className={styles.Content}>{message}</div>
	</div>
);

export default Message;
