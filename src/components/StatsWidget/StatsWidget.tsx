import styles from './StatsWidget.module.css';

const StatsWidget: React.FC<{
	fieldName: string;
	title: string;
	subTitle: string;
	accentText: string;
}> = ({ fieldName, title, subTitle, accentText, ...rest }) => (
	<div {...rest}>Test</div>
);

export default StatsWidget;
