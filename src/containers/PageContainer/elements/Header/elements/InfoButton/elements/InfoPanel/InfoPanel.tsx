import React from 'react';
import { ConnectWalletButton } from '../../../../elements';
import { InfoButtonProps } from '../../InfoButton';
import { useInfoPanelData, useInfoPanelHandlers } from './hooks';
import './_info-panel.scss';

interface InfoPanelProps extends InfoButtonProps {
	onClose: () => void;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({
	isDesktop,
	onClose,
	onConnectWallet,
}) => {
	const { formattedData } = useInfoPanelData();

	const handlers = useInfoPanelHandlers({
		props: {
			onClose,
			onConnectWallet,
		},
	});

	return (
		<div className="info-panel__container border-primary border-rounded blur">
			<div className="info-panel__content-section connect-wallet">
				<ConnectWalletButton
					onConnectWallet={handlers.handleConnectWallet}
					isDesktop={isDesktop}
				/>
			</div>
			<div className="info-panel__content-section">
				<div className="info-panel__content-section-title">
					<h3> Wilder World</h3>
					<span className="divider"></span>
				</div>
				<div className="info-panel__content-section-body">
					{formattedData.wilderWorldOptions.map((option) => (
						<div className="info-panel__content-section-body-item max-4">
							<a
								target="_blank"
								rel="noreferrer"
								href={option.link}
								key={`wilder-options-${option.link}`}
								onClick={onClose}
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
					{formattedData.zeroTechOptions.map((option) => (
						<div className="info-panel__content-section-body-item">
							<a
								target="_blank"
								rel="noreferrer"
								href={option.link}
								key={`zero-tech-options-${option.link}`}
								onClick={onClose}
							>
								<img src={option.icon} alt={option.label} />
							</a>
						</div>
					))}
				</div>
			</div>

			<div className="info-panel__content-section">
				<div className="info-panel__content-section-footer">
					{formattedData.otherOptions.map((option) => (
						<div className="info-panel__content-section-footer-item">
							<a
								target="_blank"
								rel="noreferrer"
								href={option.link}
								key={`other-options-${option.link}`}
								onClick={onClose}
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
