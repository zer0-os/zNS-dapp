import { Artwork } from 'components';
import { DAO } from '../DAOList.types';
import styles from './DAOTableRow.module.scss';

const DAOTableRow = (props: any) => {
	const dao = props.data as DAO;

	return (
		<tr className={styles.Container} onClick={props.onRowClick}>
			<td>
				<Artwork id={'1'} domain={dao.zna} name={dao.name} image={dao.icon} />
			</td>
			<td className={styles.Right}>${Number(dao.value).toLocaleString()}</td>
		</tr>
	);
};
export default DAOTableRow;
