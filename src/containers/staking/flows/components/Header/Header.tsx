import styles from './Header.module.scss';

type HeaderProps = {
	text: string;
};

const Header = ({ text }: HeaderProps) => (
	<div className={styles.Container + ' width-full'}>
		<h1 className="glow-text-white">{text}</h1>
		<hr />
	</div>
);

export default Header;
