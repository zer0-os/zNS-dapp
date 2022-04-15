//- React Imports
import React, { useState, useMemo } from 'react';

//- Type Imports
import { Maybe, DisplayParentDomain, Attribute } from 'lib/types';

//- Constant Imports
import { NFT_ATTRIBUTES_VISIBLE_COUNTS_BY_VIEWPORT } from '../../NFTView.constants';

//- Style Imports
import styles from '../../NFTView.module.scss';

//- Componennt level type definitions
type AttributesProps = {
	znsDomain: Maybe<DisplayParentDomain>;
};

export const Attributes: React.FC<AttributesProps> = ({ znsDomain }) => {
	const [isCollapsed, toggleCollapsed] = useState<boolean>(true);

	const initialVisibleAttributesCount: number = useMemo(() => {
		const isTablet = window.innerWidth > 414 && window.innerWidth < 768;
		const isMobile = window.innerWidth <= 414;

		if (isMobile) return NFT_ATTRIBUTES_VISIBLE_COUNTS_BY_VIEWPORT.MOBILE;
		if (isTablet) return NFT_ATTRIBUTES_VISIBLE_COUNTS_BY_VIEWPORT.TABLET;
		return NFT_ATTRIBUTES_VISIBLE_COUNTS_BY_VIEWPORT.DESKTOP;
	}, []);

	const initialHiddenAttributesCount: number = useMemo(() => {
		if (
			znsDomain?.attributes?.length &&
			znsDomain.attributes.length > initialVisibleAttributesCount
		) {
			return znsDomain.attributes.length - initialVisibleAttributesCount;
		}

		return 0;
	}, [znsDomain, initialVisibleAttributesCount]);

	const visibleAttributes: Attribute[] = useMemo(() => {
		if (!znsDomain?.attributes) {
			return [];
		}

		const visibleAttributesCount = isCollapsed
			? initialVisibleAttributesCount
			: znsDomain.attributes.length;

		return znsDomain.attributes.slice(0, visibleAttributesCount);
	}, [znsDomain, isCollapsed, initialVisibleAttributesCount]);

	if (visibleAttributes.length === 0) {
		return null;
	}

	return (
		<section className={styles.Attributes}>
			<div className={styles.AttributesContainer}>
				<h4>Attributes</h4>
				<ul className={styles.AttributesGrid}>
					{visibleAttributes.map((attribute: Attribute, index: number) => (
						<li
							className={`${styles.AttributesWrapper} ${
								index > 10 ? styles.SetOpacityAnimation : ''
							}`}
							key={index}
						>
							<span className={styles.Traits}>{attribute.trait_type}</span>
							<span className={styles.Properties}>{attribute.value} </span>
						</li>
					))}

					{/* Show / Hide more button */}
					{initialHiddenAttributesCount > 0 && (
						<button
							className={`${styles.ToggleAttributes} ${
								!isCollapsed ? styles.SetOpacityAnimation : ''
							}`}
							onClick={() => toggleCollapsed(!isCollapsed)}
						>
							{isCollapsed
								? initialHiddenAttributesCount + ' More'
								: 'Show Less'}
						</button>
					)}
				</ul>
			</div>
		</section>
	);
};

export default Attributes;
