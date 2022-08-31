//- React Imports
import React from 'react';

//- Components Imports
import { ConnectWalletButton } from '../../../../elements';
import { InfoButtonProps } from '../../InfoButton';

//- Library Imports
import classnames from 'classnames';

import {
	WILDER_WORLD_OPTIONS,
	ZERO_TECH_OPTIONS,
	ZNS_OTHER_OPTIONS,
} from './InfoPanel.constants';

//- Styles Imports
import './_info-panel.scss';

interface InfoPanelProps extends InfoButtonProps {}

export const InfoPanel: React.FC<InfoPanelProps> = ({
	isDesktop,
	isWalletConnected,
	onConnectWallet,
}) => {
	return (
		<div className="info-panel__content">
			<div
				className={classnames('info-panel__content-section connect-wallet', {
					'info-panel__content-section connect-wallet--is-wallet-connected':
						!isWalletConnected,
				})}
			>
				{isWalletConnected && (
					<ConnectWalletButton
						onConnectWallet={onConnectWallet}
						isDesktop={isDesktop}
					/>
				)}
			</div>
			<div className="info-panel__content-section">
				<div className="info-panel__content-section">
					<div className="info-panel__content-section-title">
						<h3> Wilder World</h3>
						<span className="divider"></span>
					</div>
					<div className="info-panel__content-section-body">
						{Object.values(WILDER_WORLD_OPTIONS).map((option) => (
							<div
								className="info-panel__content-section-body-item max-4"
								key={`wilder-options-${option.link}`}
							>
								<a target="_blank" rel="noreferrer" href={option.link}>
									<img src={option.icon} alt={option.label} />
								</a>
							</div>
						))}
					</div>
				</div>
			</div>

			<div className="info-panel__content-section">
				<div className="info-panel__content-section-title">
					<h3> Zero Tech</h3>
					<span className="divider"></span>
				</div>
				<div className="info-panel__content-section-body">
					{Object.values(ZERO_TECH_OPTIONS).map((option) => (
						<div
							className="info-panel__content-section-body-item"
							key={`zero-tech-options-${option.link}`}
						>
							<a
								target="_blank"
								rel="noreferrer"
								href={option.link}
								key={`zero-tech-options-${option.link}`}
							>
								<img src={option.icon} alt={option.label} />
							</a>
						</div>
					))}
				</div>
			</div>

			<div className="info-panel__content-section">
				<div className="info-panel__content-section-footer">
					{Object.values(ZNS_OTHER_OPTIONS).map((option) => (
						<div
							className="info-panel__content-section-footer-item"
							key={`other-options-${option.link}`}
						>
							<a
								target="_blank"
								rel="noreferrer"
								href={option.link}
								key={`other-options-${option.link}`}
							>
								{option.label}
							</a>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
