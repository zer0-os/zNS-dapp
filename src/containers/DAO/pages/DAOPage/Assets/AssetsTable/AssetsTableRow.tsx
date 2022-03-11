import { Artwork } from 'components';
import { ethers } from 'ethers';
import millify from 'millify';
import styles from './AssetsTableRow.module.scss';
import openIcon from 'assets/open-external-url.svg';
import classNames from 'classnames';

export type Asset = {
	image: string;
	name: string;
	ticker: string;
};

type AssetsTableRowData = {
	asset: Asset | string;
	quantity: number;
	value: ethers.BigNumber;
};

const AssetsTableRow = (props: any) => {
	const { data } = props;
	const { asset, quantity, value } = data as AssetsTableRowData;

	const assetColumn = () => {
		if (typeof asset === 'string') {
			return <p>{asset}</p>;
		} else {
			return (
				<Artwork
					id={'1'}
					domain={asset.ticker}
					name={asset.name}
					image={asset.image}
				/>
			);
		}
	};

	return (
		<tr
			className={classNames(styles.Container, props.className)}
			onClick={props.onRowClick}
		>
			<td>{assetColumn()}</td>
			<td className={styles.Right}>
				{millify(quantity, {
					precision: 2,
					lowercase: false,
				})}
			</td>
			<td className={styles.Right}>{value.toString()}</td>
			<td className={classNames(styles.Right, styles.Action)}>
				<img
					alt="open icon"
					className={styles.Close}
					src={openIcon}
					style={{ height: 32, width: 32, padding: 6 }}
				/>
			</td>
		</tr>
	);
};

export default AssetsTableRow;
