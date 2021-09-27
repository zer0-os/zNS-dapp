import { Spinner } from 'components';

import styles from './Loading.module.css';

type LoadingProps = {
	text: string;
};

const Loading = (props: LoadingProps) => {
	return (
		<section className={styles.Container}>
			<Spinner /> <span>{props.text}</span>
		</section>
	);
};

export default Loading;
