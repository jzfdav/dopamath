import { animate, motion, type PanInfo, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { playTickSound, triggerHaptic } from "@/utils/audio";

interface TimeSelectorProps {
	options: number[];
	selected: number;
	onSelect: (value: number) => void;
}

const ITEM_WIDTH = 80;
const ITEM_SPACING = 20;
const FULL_ITEM_WIDTH = ITEM_WIDTH + ITEM_SPACING;

export const TimeSelector = ({
	options,
	selected,
	onSelect,
}: TimeSelectorProps) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [width, setWidth] = useState(0);
	const x = useMotionValue(0);

	// Handle Circular Logic: Internal options list (Triple for infinite feel)
	const internalOptions = [...options, ...options, ...options];
	const offsetCount = options.length;

	useEffect(() => {
		if (containerRef.current) {
			const containerWidth = containerRef.current.offsetWidth;
			setWidth(containerWidth);

			const centerOffset = containerWidth / 2;
			const selectedIndex = options.indexOf(selected) + offsetCount;
			const initialX =
				centerOffset - selectedIndex * FULL_ITEM_WIDTH - ITEM_WIDTH / 2;
			x.set(initialX);
		}
	}, [options, selected, x, offsetCount]);

	const handleDragEnd = (_: unknown, info: PanInfo) => {
		const centerOffset = width / 2;
		// Determine targeted snap point considering momentum
		const targetX = x.get() + info.velocity.x * 0.1;

		const rawIndex =
			(centerOffset - ITEM_WIDTH / 2 - targetX) / FULL_ITEM_WIDTH;
		let snappedIndex = Math.round(rawIndex);

		// Clamp to valid range of the triple-list
		snappedIndex = Math.max(
			0,
			Math.min(snappedIndex, internalOptions.length - 1),
		);

		const finalX =
			centerOffset - snappedIndex * FULL_ITEM_WIDTH - ITEM_WIDTH / 2;

		// Animate to snap point
		animate(x, finalX, {
			type: "spring",
			stiffness: 400,
			damping: 40,
			onComplete: () => {
				// Re-center for infinite loop if we're in the side sets
				if (snappedIndex < offsetCount || snappedIndex >= offsetCount * 2) {
					const adjustedIndex =
						snappedIndex < offsetCount
							? snappedIndex + offsetCount
							: snappedIndex - offsetCount;

					const resetX =
						centerOffset - adjustedIndex * FULL_ITEM_WIDTH - ITEM_WIDTH / 2;
					x.set(resetX);
				}
			},
		});

		const actualValue = internalOptions[snappedIndex];
		if (actualValue !== selected) {
			onSelect(actualValue);
			playTickSound();
			triggerHaptic("light");
		}
	};

	return (
		<div
			className="relative h-24 w-full flex items-center justify-center overflow-hidden touch-pan-y"
			ref={containerRef}
		>
			{/* Gradient masks for fading edges */}
			<div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-black via-black/80 to-transparent z-10 pointer-events-none"></div>
			<div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black via-black/80 to-transparent z-10 pointer-events-none"></div>

			{/* Selection Indicator (Center highlight) */}
			<div className="absolute w-[80px] h-[80px] rounded-2xl border-2 border-primary/50 shadow-[0_0_20px_rgba(0,255,157,0.2)] z-0 box-content"></div>

			<motion.div
				className="flex absolute left-0 cursor-grab active:cursor-grabbing"
				style={{ x }}
				drag="x"
				dragElastic={0.1}
				onDragEnd={handleDragEnd}
			>
				{internalOptions.map((opt, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: Duplicate values required for infinite loop visual effect
					<Item key={`${opt}-${i}`} value={opt} isSelected={opt === selected} />
				))}
			</motion.div>
		</div>
	);
};

interface ItemProps {
	value: number;
	isSelected: boolean;
}

const Item = ({ value, isSelected }: ItemProps) => {
	return (
		<motion.div
			className={`
                flex items-center justify-center
                w-[80px] h-[80px] rounded-xl flex-shrink-0 mr-[20px] select-none
                ${isSelected ? "bg-primary/20 text-white" : "bg-white/5 text-white/40"}
            `}
			animate={{
				scale: isSelected ? 1.1 : 0.9,
				opacity: isSelected ? 1 : 0.5,
			}}
			whileTap={{ scale: 0.95 }}
		>
			<span
				className={`text-2xl font-mono font-bold ${isSelected ? "text-primary" : ""}`}
			>
				{value}
			</span>
			<span className="text-[10px] ml-1 mb-2 opacity-50">min</span>
		</motion.div>
	);
};
