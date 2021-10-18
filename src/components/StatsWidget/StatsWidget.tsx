import styles from './StatsWidget.module.css';

const StatsWidget: React.FC<{
	fieldName: string;
	title: string;
	subTitle?: string;
	accentText: string;
}> = ({ fieldName, title, subTitle, accentText, ...rest }) => (
	<div {...rest} className={styles.StatsWidget}>
		<div className={styles.StatsFieldName}>{fieldName}</div>
		<div className={styles.StatsTitle}>{title}</div>
		<div className={styles.StatsSubText}>
			{subTitle && <span>{subTitle} </span>}
			{accentText && (
				<span className={styles.StatsAccentText}> ({accentText})</span>
			)}
		</div>
	</div>
);

export default StatsWidget;
