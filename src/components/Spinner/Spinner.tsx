import styles from './Spinner.module.scss';
import classNames from 'classnames';

const Spinner = ({ className, ...props }: any) => (
	<div className={classNames(styles.Spinner, className)} {...props}></div>
);

export default Spinner;
