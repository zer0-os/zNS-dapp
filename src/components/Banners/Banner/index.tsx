//- React Imports
import React from 'react';
import { useHistory } from 'react-router-dom';

//- Components Imports
import Banner from './Banner';

//- Constants Imports
import { ROUTES } from 'constants/routes';
import { TargetType, Protocols } from './Banner.constants';

//- Utils Imports
import { getNetworkZNA } from 'lib/utils';

//- Hooks Imports
import useBannerData from './hooks/useBannerData';

//- Style Imports
import classNames from 'classnames/bind';
import styles from './Banner.module.scss';

const cx = classNames.bind(styles);

const BannerContainer: React.FC = () => {
	const history = useHistory();

	const {
		bannerContent: data,
		isBanner,
		hasCountdown,
		onFinish,
		background,
	} = useBannerData();

	const hasProtocol = data?.target?.value.includes(Protocols);

	const onBannerClick = () => {
		if (data?.target?.type === TargetType.URL) {
			if (hasProtocol) {
				window.open(data?.target?.value, '_blank');
			} else {
				history.push(`${ROUTES.MARKET}/${getNetworkZNA(data?.target?.value)}`);
			}
		} else {
			return;
		}
	};

	return (
		<div
			className={cx(styles.BannerContainer, {
				isBanner: isBanner,
			})}
		>
			{isBanner && (
				<Banner
					primaryText={data?.primaryText}
					secondaryText={data?.secondaryText}
					background={background}
					buttonText={data?.buttonText}
					endTime={data?.endTime}
					hasCountdown={hasCountdown}
					onClick={onBannerClick}
					onFinish={onFinish}
				/>
			)}
		</div>
	);
};

export default BannerContainer;
