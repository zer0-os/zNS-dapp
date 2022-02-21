import styles from './Detail.module.scss';
import classNames from 'classnames';

type DetailProps = {
	bottomText?: string | React.ReactNode;
	className?: string;
	text: string | React.ReactNode;
	subtext: string; // @todo could change to topText
};

const Detail = ({ className, text, subtext, bottomText }: DetailProps) => (
	<div className={classNames(styles.Container, className)}>
		{/* Top */}
		{typeof subtext === 'string' ? (
			<span className={styles.Top}>{subtext}</span>
		) : (
			subtext
		)}
		{/* Middle */}
		{typeof text === 'string' ? (
			<span className={styles.Main}>{text}</span>
		) : (
			text
		)}
		{/* Bottom */}
		{typeof bottomText === 'string' ? (
			<span className={styles.Bottom}>{bottomText}</span>
		) : (
			bottomText
		)}
	</div>
);

export default Detail;
