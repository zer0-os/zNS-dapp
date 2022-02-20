import styles from './Detail.module.scss';
import classNames from 'classnames';

type DetailProps = {
	className?: string;
	text: string | React.ReactNode;
	subtext: string;
};

const Detail = ({ className, text, subtext }: DetailProps) => (
	<div className={classNames(styles.Container, className)}>
		<>{typeof subtext === 'string' ? <span>{subtext}</span> : text}</>
		<>{typeof text === 'string' ? <span>{text}</span> : text}</>
	</div>
);

export default Detail;
