import { mockDAOs } from './DAOList.mock';
import DAOTable from './DAOTable/DAOTable';
import genericStyles from '../Container.module.scss';
import { StatsWidget } from 'components';
import classNames from 'classnames';

const DAOList = () => {
	return (
		<div
			className={classNames(
				genericStyles.Container,
				'main',
				'background-primary',
				'border-primary',
				'border-rounded',
			)}
		>
			<ul className={genericStyles.Stats}>
				<StatsWidget
					className="normalView"
					fieldName={'Total Value'}
					isLoading={false}
					title={'$1,234,567.00'}
					subTitle={<span className="text-success">(+12% week)</span>}
				/>
				<StatsWidget
					className="normalView"
					fieldName={'DAOs'}
					isLoading={false}
					title={mockDAOs.length}
				/>
				<StatsWidget
					className="normalView"
					fieldName={'WILD Holders'}
					isLoading={false}
					title={'1,234'}
					subTitle={<span className="text-success">(+12% week)</span>}
				/>
			</ul>
			<DAOTable daos={mockDAOs} isLoading={false} />
		</div>
	);
};

export default DAOList;
