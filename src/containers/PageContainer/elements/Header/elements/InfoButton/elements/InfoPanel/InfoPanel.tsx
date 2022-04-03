import { LINKS } from 'constants/nav';
import React from 'react';
import { Link } from 'react-router-dom';
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
		<div className="info-panel__content">
			<div className="info-panel__content-section connect-wallet">
				<ConnectWalletButton
					onConnectWallet={onConnectWallet}
					isDesktop={isDesktop}
				/>
			</div>
			<div className="info-panel__content-section">
				<div className="info-panel_nav info-panel__content-section">
					<div className="info-panel__content-section-title">
						<h3> Apps</h3>
						<span className="divider"></span>
					</div>
					<ul className="info-panel__content-section-nav info-panel__content-section-body">
						{LINKS.map((l) => (
							<li key={l.label}>
								<Link to={l.route}>
									<img alt={`${l.label.toLowerCase()} icon`} src={l.icon} />
									<label>{l.label}</label>
								</Link>
							</li>
						))}
					</ul>
				</div>

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
