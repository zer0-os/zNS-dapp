//- Component Imports
import { Detail, NFTMedia, Tooltip, OptionDropdown } from 'components';

//- Asset Imports
import shareIcon from '../../assets/share.svg';
import downloadIcon from '../../assets/download.svg';
import moreIcon from '../../assets/more-vertical.svg';

//- Style Imports
import styles from './NFT.module.scss';

//- Library Imports
import { truncateWalletAddress } from 'lib/utils';
//- Type Imports
import { Option } from 'components/Dropdowns/OptionDropdown/OptionDropdown';

export const Amount = (amount: string) => (
	<span className={styles.Amount}>{amount}</span>
);

type OptionType = {
	icon: string;
	title: string;
}[];

type NFTProps = {
	owner: string;
	title: string;
	assetUrl: string;
	creator: string;
	options: OptionType;
	description?: string;
	onSelectOption: (option: Option) => void;
	onDownload?: () => void;
	onShare?: () => void;
};

const NFT = ({
	owner,
	title,
	assetUrl,
	creator,
	options,
	description,
	onSelectOption,
	onDownload,
	onShare,
}: NFTProps) => {
	////////////
	// Render //
	////////////
	return (
		<div className={styles.Container}>
			<div className={styles.Banner}>
				<NFTMedia alt="NFT Preview" ipfsUrl={assetUrl ?? ''} />
			</div>
			<h1>{title ?? ''}</h1>
			<div className="flex-split">
				<ul className={styles.Members}>
					<li>
						<Detail
							text={truncateWalletAddress(creator ?? '')}
							subtext={'Creator'}
						/>
					</li>
					<li>
						<Detail
							text={truncateWalletAddress(owner ?? '')}
							subtext={'Owner'}
						/>
					</li>
				</ul>
				<div className={styles.Tray}>
					<Tooltip text={'Share to Twitter'}>
						<button onClick={onShare}>
							<img src={shareIcon} alt="share asset" />
						</button>
					</Tooltip>
					<Tooltip text={'Download for Twitter'}>
						<button onClick={onDownload}>
							<img alt="download asset" src={downloadIcon} />
						</button>
					</Tooltip>
					{options.length > 0 && (
						<OptionDropdown
							onSelect={onSelectOption}
							options={options}
							className={styles.MoreDropdown}
						>
							<button>
								<img alt="more actions" src={moreIcon} />
							</button>
						</OptionDropdown>
					)}
				</div>
			</div>
			<div className={styles.Description}>{description ?? ''}</div>
		</div>
	);
};

export default NFT;
