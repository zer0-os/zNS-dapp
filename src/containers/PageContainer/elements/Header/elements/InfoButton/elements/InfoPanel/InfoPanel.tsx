import React from 'react';
import {
	WILDER_WORLD_KEYS,
	ZERO_TECK_KEYS,
	ZNS_INFO_OPTIONS,
	ZNS_OTHER_OPTIONS,
} from './InfoPanel.constants';
import './_info-panel.scss';

export const InfoPanel: React.FC = () => {
	const wilderWorldOptions = WILDER_WORLD_KEYS.map(
		(key) => ZNS_INFO_OPTIONS[key],
	);
	const zeroTechOptions = ZERO_TECK_KEYS.map((key) => ZNS_INFO_OPTIONS[key]);
	const otherOptions = ZNS_OTHER_OPTIONS;

	return (
		<div className="info-panel__container border-primary border-rounded blur">
			<div className="info-panel__content-section">
				<div className="info-panel__content-section-title">
					<h3> Wilder World</h3>
					<span className="divider"></span>
				</div>
				<div className="info-panel__content-section-body">
					{wilderWorldOptions.map((option) => (
						<div className="info-panel__content-section-body-item">
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
					{zeroTechOptions.map((option) => (
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
					{otherOptions.map((option) => (
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
