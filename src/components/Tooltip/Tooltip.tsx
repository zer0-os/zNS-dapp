//- React Imports
import React, { useMemo } from 'react';

// Library Imports
import { useLayer, useHover, Arrow } from 'react-laag';
import { motion, AnimatePresence, MotionProps } from 'framer-motion';

//- Style Imports
import styles from './Tooltip.module.scss';

type TooltipProps = {
	children: React.ReactNode | string | number;
	text: string | React.ReactElement;
	auto?: boolean;
	open?: boolean;
	openOnHover?: boolean;
	placement?:
		| 'top-start'
		| 'top-center'
		| 'top-end'
		| 'left-start'
		| 'left-center'
		| 'left-end'
		| 'right-start'
		| 'right-center'
		| 'right-end'
		| 'bottom-start'
		| 'bottom-center'
		| 'bottom-end';
	triggerOffset?: number;
	delayEnter?: number;
	delayLeave?: number;
	hideOnScroll?: boolean;
	animationProps?: MotionProps;
	triggerOnTooltip?: boolean;
	arrow?: boolean;
	tooltipClassName?: string;
};

const Tooltip: React.FC<TooltipProps> = ({
	children,
	text,
	auto = true,
	placement = 'top-center',
	triggerOffset = 8,
	delayEnter = 100,
	delayLeave = 200,
	hideOnScroll = true,
	triggerOnTooltip = false,
	open = false,
	openOnHover = true,
	arrow = true,
	tooltipClassName,
	animationProps = {
		initial: { opacity: 0, scale: 0.9 },
		animate: { opacity: 1, scale: 1 },
		exit: { opacity: 0, scale: 0.9 },
		transition: { duration: 0.1 },
	},
}) => {
	const isReactText = useMemo(() => {
		return ['string', 'number'].includes(typeof children);
	}, [children]);

	const [isOver, hoverProps] = useHover({
		delayEnter,
		delayLeave,
		hideOnScroll,
	});

	const { triggerProps, layerProps, arrowProps, renderLayer } = useLayer({
		isOpen: isOver,
		auto,
		placement,
		triggerOffset,
	});

	// when children equals text (string | number), we need to wrap it in an
	// extra span-element in order to attach props
	let trigger;
	if (isReactText) {
		trigger = (
			<span className="tooltip-text-wrapper" {...triggerProps} {...hoverProps}>
				{children}
			</span>
		);
	} else {
		// In case of an react-element, we need to clone it in order to attach our own props
		trigger = React.cloneElement(children as React.ReactElement, {
			...triggerProps,
			...hoverProps,
		});
	}

	const tooltipHoverProps = triggerOnTooltip ? hoverProps : {};

	// We're using framer-motion for our enter / exit animations.
	// This is why we need to wrap our actual tooltip inside `<AnimatePresence />`.
	return (
		<>
			{trigger}
			{renderLayer(
				<AnimatePresence>
					{isOver && (
						<motion.div
							className={
								styles.Tooltip +
								(tooltipClassName ? ` ${tooltipClassName}` : '')
							}
							{...animationProps}
							{...layerProps}
							{...tooltipHoverProps}
						>
							{text}
							{arrow && <Arrow {...arrowProps} className={styles.Arrow} />}
						</motion.div>
					)}
				</AnimatePresence>,
			)}
		</>
	);
};

export default Tooltip;
