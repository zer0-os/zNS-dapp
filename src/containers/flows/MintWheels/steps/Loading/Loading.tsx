// Component Imports
import { Spinner } from 'components';

// Style Imports
import styles from './Loading.module.scss';

type LoadingProps = {
	isMinting?: boolean;
	text: string;
};

const Loading = (props: LoadingProps) => {
	return (
		<section className={styles.Container}>
			{props.isMinting && (
				<img
					alt="loading spinner"
					className={styles.Image}
					src="https://res.cloudinary.com/fact0ry/image/upload/fl_lossy,q_50,c_fill,h_290,w_542/v1632961649/zns/cribs-mint-progress.gif"
				/>
			)}
			<span>{props.text}</span>
			<Spinner />
		</section>
	);
};

export default Loading;
