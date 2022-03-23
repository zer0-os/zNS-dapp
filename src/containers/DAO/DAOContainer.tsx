import React from 'react';

// Style Imports
// TODO: Generalize styles for both pages
import { Switch } from 'react-router-dom';
import { useNavbar } from 'lib/hooks/useNavbar';
import { useDidMount } from 'lib/hooks/useDidMount';
import styles from './DAOContainer.module.scss';
import MintDAO from './pages/MintDAO/MintDAO';
import DAOList from './pages/DAOList/DAOList';
import DAOPage from './pages/DAOPage/DAOPage';
import classNames from 'classnames';

type StakingContainerProps = {
	className?: string;
	style?: React.CSSProperties;
};

const DAOContainer: React.FC<StakingContainerProps> = ({
	className,
	style,
}) => {
	const { setNavbarTitle } = useNavbar();

	useDidMount(() => {
		setNavbarTitle(undefined);
	});

	return (
		<Switch>
			<main className={classNames(styles.Container, className)} style={style}>
				<MintDAO />
				<DAOList />
				<DAOPage />
			</main>
		</Switch>
	);
};

export default DAOContainer;
