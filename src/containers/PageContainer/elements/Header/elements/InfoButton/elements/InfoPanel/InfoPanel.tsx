import React from 'react';
import { ConnectWalletButton } from '../../../../elements';
import { InfoButtonProps } from '../../InfoButton';
import {
	WILDER_WORLD_OPTIONS,
	ZERO_TECH_OPTIONS,
	ZNS_OTHER_OPTIONS,
} from './InfoPanel.constants';
import './_info-panel.scss';

interface InfoPanelProps extends InfoButtonProps {}

export const InfoPanel: React.FC<InfoPanelProps> = ({
	isDesktop,
	onConnectWallet,
}) => {
	return (
		<div className="info-panel__content border-primary">
			<div className="info-panel__content-section connect-wallet">
				<ConnectWalletButton
					onConnectWallet={onConnectWallet}
					isDesktop={isDesktop}
				/>
			</div>
			<div className="info-panel__content-section">
				<div className="info-panel__content-section-title">
					<h3> Wilder World</h3>
					<span className="divider"></span>
				</div>
				<div className="info-panel__content-section-body">
					{Object.values(WILDER_WORLD_OPTIONS).map((option) => (
						<div className="info-panel__content-section-body-item max-4">
							<a
								target="_blank"
								rel="noreferrer"
								href={option.link}
								key={`wilder-options-${option.link}`}
							>
								<img src={option.icon} alt={option.label} />
							</a>
						</div>
					))}
				</div>
			</div>

			<div className="info-panel__content-section">
				<div className="info-panel__content-section-title">
					<h3> Zero Tech</h3>
					<span className="divider"></span>
				</div>
				<div className="info-panel__content-section-body">
					{Object.values(ZERO_TECH_OPTIONS).map((option) => (
						<div className="info-panel__content-section-body-item">
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
						<div className="info-panel__content-section-footer-item">
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
