import { Spinner } from 'components';
import styles from './StatsWidget.module.css';

const StatsWidget: React.FC<{
	fieldName: string;
	title?: string | number;
	subTitle?: string;
	accentText?: string;
	isLoading?: boolean;
}> = ({ fieldName, title, subTitle, accentText, isLoading, ...rest }) => (
	<div {...rest} className={styles.StatsWidget}>
		<div className={styles.StatsFieldName}>{fieldName}</div>
		{isLoading ? (
			<div className={styles.SpinnerContainer}>
				<Spinner />
			</div>
		) : (
			<>
				<div className={styles.StatsTitle}>{title}</div>
				<div className={styles.StatsSubText}>
					{subTitle && <span>{subTitle} </span>}
					{accentText && (
						<span className={styles.StatsAccentText}> ({accentText})</span>
					)}
				</div>
			</>
		)}
	</div>
);

export default StatsWidget;
