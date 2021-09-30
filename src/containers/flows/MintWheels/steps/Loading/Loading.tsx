// Component Imports
import { Spinner } from 'components';

// Style Imports
import styles from './Loading.module.css';

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
					src="https://res.cloudinary.com/fact0ry/image/upload/c_fill/v1632961649/zns/minting-in-progress.gif"
				/>
			)}
			<span>{props.text}</span>
			<Spinner />
		</section>
	);
};

export default Loading;
