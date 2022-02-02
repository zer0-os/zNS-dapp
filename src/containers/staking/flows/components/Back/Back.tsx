import styles from './Back.module.scss';
import backIcon from './assets/back.svg';

type BackProps = {
	onBack: () => void;
	text?: string;
};

const Back = ({ onBack, text = 'Back' }: BackProps) => (
	<button className={styles.Back + ' flex-vertical-align'} onClick={onBack}>
		<img src={backIcon} alt="back" /> {text}
	</button>
);

export default Back;
